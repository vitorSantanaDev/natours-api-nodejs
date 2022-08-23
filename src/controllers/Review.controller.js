const catchAsync = require('../utils/catchAsync')
const ReviewModel = require('../models/review.model')
const APIFeatures = require('../utils/APIFeatures')

exports.getAllReviewsController = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(ReviewModel.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate()

  const reviews = await features.query

  res.status(200).json({
    status: 'success',
    results: reviews.length,
    requestTimeAte: req.requestTimeAt,
    data: {
      reviews,
    },
  })
})

exports.createReviewController = catchAsync(async (req, res, next) => {
  const review = await ReviewModel.create(req.body)

  res.status(200).json({
    status: 'success',
    data: {
      review,
    },
  })
})
