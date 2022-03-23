import mongodb from 'mongodb';
const ObjectId = mongodb.ObjectId;

let reviews;

export default class ReviewsDAO {
  static async injectDB(conn) {
    if (reviews) {
      return;
    }

    try {
      reviews = await conn.db(process.env.RESTREVIEWS_NS).collection('reviews');
      console.log('successfully connected to reviews db');
    } catch (e) {
      console.error(`Error connecting to reviews database: ${e}`);
    }
  }

  static async addReview(restaurantId, userInfo, review, date) {
    try {
      const doc = {
        name: userInfo.name,
        user_id: userInfo._id,
        date: date,
        text: review,
        restaurant_id: ObjectId(restaurantId),
      };

      const response = await reviews.insertOne(doc);
      return response;
    } catch (e) {
      console.error(`Error adding review: ${e}`);
      throw e;
    }
  }

  static async updateReview(reviewId, userId, review, date) {
    try {
      const doc = {
        date: date,
        text: review,
      };

      const response = await reviews.updateOne(
        { _id: ObjectId(reviewId), user_id: userId },
        { $set: doc }
      );
      return response;
    } catch (e) {
      console.error(`Error updating review: ${e}`);
      throw e;
    }
  }

  static async deleteReview(reviewId, userId) {
    try {
      const response = await reviews.deleteOne({ _id: ObjectId(reviewId), user_id: userId });
      return response;
    } catch (e) {
      console.error(`Error deleting review: ${e}`);
      throw e;
    }
  }
}