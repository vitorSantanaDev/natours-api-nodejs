const jwt = require('jsonwebtoken')
const crypto = require('crypto')

const UserModel = require('../models/user.model')
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')
const Email = require('../utils/email')

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  })
}

const createSendToken = (user, statusCode, res, sendUserData = true) => {
  const token = signToken(user._id)
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  }

  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true
  res.cookie('jwt', token, cookieOptions)

  res.status(statusCode).json({
    status: 'success',
    data: {
      token,
      user: sendUserData ? user : null,
    },
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

  const url = `${req.protocol}://${req.get('host')}/me`

  await new Email(newUser, url).sendWelcome()

  let userResult = newUser.toObject()
  delete userResult['password']
  delete userResult['active']

  createSendToken(userResult, 201, res)
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

  createSendToken(user, 200, res, false)
})

exports.logoutController = catchAsync(async (req, res, next) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  })
  res.status(200).json({ status: 'success' })
})

exports.forgotPasswordController = catchAsync(async (req, res, next) => {
  // get user based on POsted email
  const user = await UserModel.findOne({ email: req.body.email })
  if (!user) {
    return next(new AppError(`There is no user with email address.`, 404))
  }
  // Generate the random reset token
  const resetToken = await user.createPasswordResetToken()
  await user.save({ validateBeforeSave: false })
  // send it to user's email

  try {
    const resetURL = `${req.protocol}://${req.get(
      'host'
    )}/api/v1/users/reset-password/${resetToken}`

    await new Email(user, resetURL).sendPasswordReset()
    res.status(200).json({
      status: 'success',
      message: 'Token send to email',
    })
  } catch (err) {
    user.passwordResetToken = undefined
    user.passwordResetExpires = undefined
    await user.save({ validateBeforeSave: false })

    return next(
      new AppError(
        `There was an error sending the email. Try again later!`,
        500
      )
    )
  }
})

exports.resetPasswordController = catchAsync(async (req, res, next) => {
  // get user based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex')

  const user = await UserModel.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  })

  // If token has not expired, and there is user, set the new user
  if (!user) {
    return next(new AppError(`Token is invalid or has expired`, 400))
  }

  user.password = req.body.password
  user.passwordConfirm = req.body.passwordConfirm
  user.passwordResetToken = undefined
  user.passwordResetExpires = undefined
  await user.save()

  // Update changedPassowrdAt property for the current user

  // Log the user in, send JWT
  createSendToken(user, 200, res)
})

exports.updatePasswordController = catchAsync(async (req, res, next) => {
  // Get user from collection
  const user = await UserModel.findById(req.user.id).select('+password')
  // Check if POSTed current password is correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError(`Your current password is wrong.`, 401))
  }
  // If so, update password
  user.password = req.body.password
  user.passwordConfirm = req.body.passwordConfirm
  await user.save()
  //Log user in, send JWT
  createSendToken(user, 200, res)
})
