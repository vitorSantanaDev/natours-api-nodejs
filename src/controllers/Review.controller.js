const catchAsync = require('../utils/catchAsync')
const ReviewModel = require('../models/review.model')
const APIFeatures = require('../utils/APIFeatures')

exports.getAllReviewsController = catchAsync(async (req, res, next) => {
  const { tourID } = req.params
  let filter = {}

  if (tourID) {
    filter = { tour: tourID }

    const reviews = await ReviewModel.find(filter)

    return res.status(200).json({
      status: 'success',
      results: reviews.length,
      requestTimeAte: req.requestTimeAt,
      data: {
        reviews,
      },
    })
  }

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
  // allow nested routes
  if (!req.body.tour) req.body.tour = req.params.tourID
  if (!req.body.user) req.body.user = req.user.id

  const review = await ReviewModel.create(req.body)

  res.status(200).json({
    status: 'success',
    data: {
      review,
    },
  })
})
