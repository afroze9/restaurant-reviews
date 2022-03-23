import { ObjectId } from "mongodb"

let restaurants;

export default class RestaurantsDAO {
  static async injectDB(conn) {
    if (restaurants) {
      return;
    }

    try {
      restaurants = await conn.db(process.env.RESTREVIEWS_NS).collection('restaurants');
    } catch (e) {
      console.error(`Error connecting to restaurants database: ${e}`);
    }
  }

  static async getRestaurants({
    filters = null,
    page = 0,
    restaurantsPerPage = 20,
  } = {}) {
    let query;

    if (filters) {
      if ('name' in filters) {
        query = { $text: { $search: filters['name'] } };
      } else if ('cuisine' in filters) {
        query = { 'cuisine': { $eq: filters['cuisine'] } };
      } else if ('zipcode' in filters) {
        query = { 'address.zipcode': { $eq: filters['zipcode'] } };
      }
    }

    let cursor;

    try {
      cursor = await restaurants.find(query);
    } catch (e) {
      console.error(`Error getting restaurants: ${e}`);
      return { restaurantList: [], totalRestaurants: 0 };
    }

    const displayCursor = cursor
      .skip(page * restaurantsPerPage)
      .limit(restaurantsPerPage);

    try {
      const restaurantList = await displayCursor.toArray();
      const totalRestaurants = page === 0 ? await restaurants.countDocuments(query) : 0;
      return { restaurantList: restaurantList, totalRestaurants: totalRestaurants };
    } catch (e) {
      console.error(`Error getting restaurants: ${e}`);
      return { restaurantList: [], totalRestaurants: 0 };
    }
  }

  static async getRestaurantById(id) {
    try {
      const pipeline = [
        {
          $match: {
            _id: new ObjectId(id)
          }
        },
        {
          $lookup: {
            from: 'reviews',
            let: {
              id: '$_id'
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ['$restaurant_id', '$$id']
                  }
                }
              },
              {
                $sort: {
                  date: -1
                }
              }
            ],
            as: 'reviews'
          }
        },
        {
          $addFields: {
            reviews: '$reviews'
          }
        }
      ];

      return await restaurants.aggregate(pipeline).next();
    } catch (e) {
      console.error(`Error getting restaurant: ${e}`);
      return null;
    }
  }

  static async getRestaurantCuisines() {
    try {
      return await restaurants.distinct('cuisine');
    } catch (e) {
      console.error(`Error getting restaurant cuisines: ${e}`);
      return [];
    }
  }
}