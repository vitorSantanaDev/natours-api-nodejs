const TourModel = require('../models/tour.model')

const catchAsync = require('../utils/catchAsync')

exports.getOverview = catchAsync(async (req, res) => {
  const tours = await TourModel.find()

  res.status(200).render('overview', {
    title: 'All Tours',
    tours,
  })
})

exports.getTour = catchAsync(async (req, res) => {
  const { slug } = req.params

  const tour = await TourModel.findOne({ slug }).populate({
    path: 'reviews',
    fields: 'review rating user',
  })

  res.status(200).render('tour', {
    title: 'The Forest Hiker Tour',
    tour,
  })
})
