import RestaurantsDAO from "../dao/restaurantsDAO.js";

export default class RestaurantsController {
  static async apiGetRestaurants(req, res, next) {
    const restaurantsPerPage = req.query.restaurantsPerPage ? parseInt(req.query.restaurantsPerPage, 10) : 20;
    const page = req.query.page ? parseInt(req.query.page, 10) : 0;

    let filters = {};
    if (req.query.cuisine) {
      filters.cuisine = req.query.cuisine;
    } else if (req.query.zipcode) {
      filters.zipcode = req.query.zipcode;
    } else if (req.query.name) {
      filters.name = req.query.name;
    }

    const { restaurantList, totalRestaurants } = await RestaurantsDAO.getRestaurants({
      filters,
      page,
      restaurantsPerPage
    });

    let response = {
      restaurants: restaurantList,
      page: page,
      filters: filters,
      entriesPerPage: restaurantsPerPage,
      totalResults: totalRestaurants
    };

    res.json(response);
  }

  static async apiGetRestaurantById(req, res, next) {
    try {
      const restaurantId = req.params.id;
      const restaurant = await RestaurantsDAO.getRestaurantById(restaurantId);
      if (!restaurant) {
        res.status(404).json({ error: "Restaurant not found" });
        return;
      }

      res.json(restaurant);
    } catch (e) {
      console.error(`Error getting restaurant: ${e}`);
      res.status(500).json({ error: e });
    }
  }

  static async apiGetRestaurantCuisines(req, res, next) {
    try {
      const restaurantCuisines = await RestaurantsDAO.getRestaurantCuisines();
      res.json(restaurantCuisines);
    } catch (e) {
      console.error(`Error getting restaurant cuisines: ${e}`);
      res.status(500).json({ error: e });
    }
  }
}