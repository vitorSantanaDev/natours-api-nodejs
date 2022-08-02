const AppError = require('../utils/appError')
const catchAsync = require('../utils/catchAsync')
const jwt = require('jsonwebtoken')

const { promisify } = require('util')

const UserModel = require('../models/user.model')

exports.protect = catchAsync(async (req, res, next) => {
  const { authorization } = req.headers

  let token

  if (authorization && authorization.startsWith('Bearer')) {
    token = authorization.split(' ')[1]
  }

  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401)
    )
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)
  const freshUser = await UserModel.findById(decoded.id)

  if (!freshUser) {
    return next(
      new AppError(
        `The token belonging to this token does no longer exist.`,
        401
      )
    )
  }

  // Check if user changed password after the token was issued
  if (freshUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError(`User recently changed password! Please log in again.`, 401)
    )
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = freshUser
  next()
})
