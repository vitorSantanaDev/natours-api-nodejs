const UserModel = require('../models/user.model')
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')

const {
  deleteOne,
  updateOne,
  getOne,
  getAll,
} = require('../functions/handlerFactory')

exports.getUserController = getOne(UserModel)
exports.getAllUsersController = getAll(UserModel)
exports.deleteUserController = deleteOne(UserModel)
exports.updateUserController = updateOne(UserModel)

const filterObject = (obj, ...allowedFields) => {
  const newObject = {}
  Object.keys(obj).forEach((key) => {
    if (allowedFields.includes(key)) newObject[key] = obj[key]
  })
  return newObject
}

exports.updateCurrentUserController = catchAsync(async (req, res, next) => {
  // create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        `This route is not for password updates. Please use /update-password`,
        400
      )
    )
  }
  // filtered out unwanted fields name that are no allowed, to update
  const filteredBody = filterObject(req.body, 'name', 'email')
  if (req.file) filteredBody.photo = req.file.filename

  // update user document
  const updatedUser = await UserModel.findByIdAndUpdate(
    req.user.id,
    filteredBody,
    {
      new: true,
      runValidators: true,
    }
  )

  res.status(200).json({
    status: 'success',
    user: updatedUser,
  })
})

exports.deleteCurrentUserController = catchAsync(async (req, res, next) => {
  await UserModel.findByIdAndUpdate(req.user.id, { active: false })
  res.status(204).json({
    status: 'success',
    data: null,
  })
})

exports.createUserController = (req, res) => {
  res.status(500).json({
    status: 500,
    message: 'this route is not yet defined',
  })
}
