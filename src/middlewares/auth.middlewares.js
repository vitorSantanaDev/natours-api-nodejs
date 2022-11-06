const AppError = require('../utils/appError')
const catchAsync = require('../utils/catchAsync')
const jwt = require('jsonwebtoken')

const { promisify } = require('util')

const UserModel = require('../models/user.model')

exports.protect = catchAsync(async (req, res, next) => {
  const { authorization } = req.headers
  const { cookies } = req

  let token

  if (authorization && authorization.startsWith('Bearer')) {
    token = authorization.split(' ')[1]
  } else if (cookies.jwt) {
    token = cookies.jwt
  }

  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401)
    )
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)
  const currentUser = await UserModel.findById(decoded.id)

  if (!currentUser) {
    return next(
      new AppError(
        `The token belonging to this token does no longer exist.`,
        401
      )
    )
  }

  // Check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError(`User recently changed password! Please log in again.`, 401)
    )
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser
  next()
})

// 	ONLY FOR RENDERED PAGE, NO ERROS
exports.checkingIfTheUserIsLoggedIn = async (req, res, next) => {
  try {
    const { cookies } = req

    if (cookies.jwt) {
      // verify token
      const decoded = await promisify(jwt.verify)(
        cookies.jwt,
        process.env.JWT_SECRET
      )

      // check if user still exists
      const currentUser = await UserModel.findById(decoded.id)
      if (!currentUser) {
        return next()
      }

      // Check if user changed password after the token was issued
      if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next()
      }

      // THERE IS A LOGGED IN USER
      res.locals.user = currentUser
      return next()
    }
  } catch (err) {
    return next()
  }
  next()
}
