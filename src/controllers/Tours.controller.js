const TourModel = require('../models/tour.model')
const catchAsync = require('../utils/catchAsync')

const {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} = require('../functions/handlerFactory')
const AppError = require('../utils/appError')

exports.getAllToursController = getAll(TourModel)
exports.createTourController = createOne(TourModel)
exports.updateTourController = updateOne(TourModel)
exports.deleteTourController = deleteOne(TourModel)
exports.getTourController = getOne(TourModel, { path: 'reviews' })

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

exports.getTourWithin = catchAsync(async (req, res, next) => {
  const { distance, latlng, unit } = req.params
  const [lat, lng] = latlng.split(',')

  const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1

  if (!lat || !lng) {
    next(
      new AppError(
        'Please provider latitutr and longitude in the format lat,lang.',
        400
      )
    )
  }

  const tours = await TourModel.find({
    startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  })

  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      data: tours,
    },
  })
})

exports.getDistances = catchAsync(async (req, res, next) => {
  const { latlng, unit } = req.params
  const [lat, lng] = latlng.split(',')

  const multiplier = unit === 'mi' ? 0.000621371 : 0.001

  if (!lat || !lng) {
    next(
      new AppError(
        'Please provider latitutr and longitude in the format lat,lang.',
        400
      )
    )
  }

  const distances = await TourModel.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [lng * 1, lat * 1],
        },
        distanceField: 'distance',
        distanceMultiplier: multiplier,
      },
    },
    {
      $project: {
        distance: 1,
        name: 1,
      },
    },
  ])

  res.status(200).json({
    status: 'success',
    results: distances.length,
    data: {
      data: distances,
    },
  })
})
