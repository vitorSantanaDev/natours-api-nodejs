const TourModel = require('../models/tour.model')
const UserModel = require('../models/user.model')
const AppError = require('../utils/appError')
const catchAsync = require('../utils/catchAsync')

exports.getOverview = catchAsync(async (req, res, next) => {
  const tours = await TourModel.find()

  res.status(200).render('overview', {
    title: 'All Tours',
    tours,
  })
})

exports.getTour = catchAsync(async (req, res, next) => {
  const { slug } = req.params

  const tour = await TourModel.findOne({ slug }).populate({
    path: 'reviews',
    fields: 'review rating user',
  })

  if (!tour) {
    return next(new AppError(`There is no tour with that name`, 404))
  }

  res.status(200).render('tour', {
    title: `${tour.name} Tour`,
    tour,
  })
})

exports.getAccount = (req, res) => {
  res.status(200).render('account', {
    title: `Your account`,
  })
}

exports.updateUserData = catchAsync(async (req, res, next) => {
  const updatedUser = await UserModel.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.username,
      email: req.body.email,
    },
    {
      new: true,
      runValidators: true,
    }
  )
  res.status(200).render('account', {
    title: `Your account`,
    user: updatedUser,
  })
})

exports.getLoginForm = catchAsync(async (req, res, next) => {
  res.status(200).render('login', { title: 'Log into your account' })
})
