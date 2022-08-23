const TourModel = require('../models/tour.model')
const APIFeatures = require('../utils/APIFeatures')
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')

exports.getAllToursController = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(TourModel.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate()

  const tours = await features.query

  res.status(200).json({
    status: 'success',
    results: tours.length,
    requestTimeAte: req.requestTimeAt,
    data: {
      tours,
    },
  })
})

exports.createTourController = catchAsync(async (req, res, next) => {
  const tour = await TourModel.create(req.body)

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  })
})

exports.getTourController = catchAsync(async (req, res, next) => {
  const { id: tourID } = req.params
  const tour = await TourModel.findById(tourID).populate('reviews')

  if (!tour) {
    return next(new AppError(`No tour found with that ID`, 404))
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  })
})

exports.updateTourController = catchAsync(async (req, res, next) => {
  const { id: tourID } = req.params
  const tour = await TourModel.findByIdAndUpdate(tourID, req.body, {
    new: true,
    runValidators: true,
  })

  if (!tour) {
    return next(new AppError(`No tour found with that ID`, 404))
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  })
})

exports.deleteTourController = catchAsync(async (req, res, next) => {
  const { id: tourID } = req.params
  const tour = await TourModel.findByIdAndDelete(tourID)

  if (!tour) {
    return next(new AppError(`No tour found with that ID`, 404))
  }

  res.status(204).json({
    status: 'success',
    data: null,
  })
})

exports.getTourStatsController = catchAsync(async (req, res, next) => {
  const stats = await TourModel.aggregate([
    { $match: { ratingsAverage: { $gte: 4.5 } } },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        numTours: { $sum: 1 },
        numRating: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    { $sort: { avgPrice: 1 } },
  ])

  res.status(200).json({
    status: 'success',
    requestTimeAte: req.requestTimeAt,
    data: {
      stats,
    },
  })
})

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const { year } = req.params
  const plan = await TourModel.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numToursStart: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    {
      $addFields: { month: '$_id' },
    },
    {
      $project: {
        _id: 0,
      },
    },
    {
      $sort: { numToursStart: -1 },
    },
    {
      $limit: 12,
    },
  ])

  res.status(200).json({
    status: 'success',
    requestTimeAte: req.requestTimeAt,
    data: {
      plan,
    },
  })
})
