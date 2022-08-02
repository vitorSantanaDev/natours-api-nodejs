const UserModel = require('../models/user.model')
const catchAsync = require('../utils/catchAsync')

exports.getAllUsersController = catchAsync(async (req, res, next) => {
  const users = await UserModel.find()

  res.status(200).json({
    status: 'success',
    results: users.length,
    requestTimeAte: req.requestTimeAt,
    data: {
      users,
    },
  })
})

exports.createUserController = (req, res) => {
  res.status(500).json({
    status: 500,
    message: 'this route is not yet defined',
  })
}

exports.getUserController = (req, res) => {
  res.status(500).json({
    status: 500,
    message: 'this route is not yet defined',
  })
}

exports.updateUserController = (req, res) => {
  res.status(500).json({
    status: 500,
    message: 'this route is not yet defined',
  })
}

exports.deleteUserController = (req, res) => {
  res.status(500).json({
    status: 500,
    message: 'this route is not yet defined',
  })
}
