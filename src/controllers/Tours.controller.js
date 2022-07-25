const TourModel = require('../models/tour.model')
const APIFeatures = require('../utils/APIFeatures')

exports.getAllToursController = async (req, res) => {
  try {
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
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    })
  }
}

exports.createTourController = async (req, res) => {
  try {
    const tour = new TourModel(req.body)

    await tour.save()

    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    })
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    })
  }
}

exports.getTourController = async (req, res) => {
  try {
    const { id: tourID } = req.params

    const tour = await TourModel.findById(tourID)

    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    })
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    })
  }
}

exports.updateTourController = async (req, res) => {
  try {
    const { id: tourID } = req.params

    const tour = await TourModel.findByIdAndUpdate(tourID, req.body, {
      new: true,
    })

    await tour.update(req.body)
    await tour.save()

    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    })
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    })
  }
}

exports.deleteTourController = async (req, res) => {
  try {
    const { id: tourID } = req.params

    await TourModel.findByIdAndDelete(tourID)

    res.status(204).json({
      status: 'success',
      data: null,
    })
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    })
  }
}

exports.getTourStatsController = async (req, res) => {
  try {
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
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    })
  }
}

exports.getMonthlyPlan = async (req, res) => {
  try {
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
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    })
  }
}
