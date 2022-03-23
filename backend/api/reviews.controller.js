import ReviewsDAO from "../dao/reviewsDAO.js";

export default class RestaurantsController {
  static async apiAddReview(req, res, next) {
    try {
      const restaurantId = req.body.restaurantId;
      const review = req.body.text;
      const userInfo = {
        name: req.body.name,
        _id: req.body.userId
      };
      const date = new Date();

      await ReviewsDAO.addReview(restaurantId, userInfo, review, date);
      res.json({ status: 'success' });
    } catch (err) {
      console.error(err.stack);
      res.status(500).json({ error: e.message });
    }
  }

  static async apiUpdateReview(req, res, next) {
    try {
      const reviewId = req.body.reviewId;
      const userId = req.body.userId;
      const review = req.body.text;
      const date = new Date();

      const response = await ReviewsDAO.updateReview(reviewId, userId, review, date);
      const { error } = response;

      if (error) {
        res.status(400).json({ error: error });
      }

      if (response.modifiedCount === 0) {
        throw new Error('Unable to update review - user not op');
      }
      res.json({ status: 'success' });
    } catch (err) {
      console.error(err.stack);
      res.status(500).json({ error: e.message });
    }
  }

  static async apiDeleteReview(req, res, next) {
    try {
      const reviewId = req.query.reviewId;
      const userId = req.body.userId;

      const resonse = await ReviewsDAO.deleteReview(reviewId, userId);

      res.json({ status: 'success' });
    } catch (e) {
      console.error(err.stack);
      res.status(500).json({ error: e.message });
    }
  }
}