const ReviewModel = require('../models/review.model')

const {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} = require('../functions/handlerFactory')

exports.getReviewController = getOne(ReviewModel)
exports.getAllReviewsController = getAll(ReviewModel)
exports.createReviewController = createOne(ReviewModel)
exports.deleteReviewController = deleteOne(ReviewModel)
exports.updateReviewController = updateOne(ReviewModel)

exports.setTourUserIDsMiddleware = (req, res, next) => {
  // allow nested routes
  if (!req.body.tour) req.body.tour = req.params.tourID
  if (!req.body.user) req.body.user = req.user.id
  next()
}
