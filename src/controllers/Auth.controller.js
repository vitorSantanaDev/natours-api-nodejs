const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const UserModel = require('../models/user.model')
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  })
}

exports.signUpController = catchAsync(async (req, res, next) => {
  const newUser = await UserModel.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    passwordChangedAt: req.body.passwordChangedAt,
    role: req.body.role,
  })

  let userResult = newUser.toObject()
  delete userResult['password']

  const token = signToken(userResult._id)

  res.status(201).json({
    status: 'success',
    data: {
      token,
      user: userResult,
    },
  })
})

exports.loginController = catchAsync(async (req, res, next) => {
  const { email, password } = req.body

  if (!email || !password) {
    return next(new AppError(`Please provider email and password`, 400))
  }

  const user = await UserModel.findOne({ email }).select('+password')
  const passwordIsValid = await user.correctPassword(password, user.password)

  if (!user || !passwordIsValid) {
    return next(new AppError(`Invalid email or password`, 401))
  }

  const token = signToken(user._id)

  res.status(200).json({
    status: 'success',
    token,
  })
})
