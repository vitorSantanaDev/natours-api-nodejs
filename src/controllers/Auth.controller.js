const UserModel = require('../models/user.model')
const catchAsync = require('../utils/catchAsync')

exports.signUpController = catchAsync(async (req, res, next) => {
  const newUser = await UserModel.create(req.body)

  res.status(201).json({
    status: 'success',
    data: {
      user: newUser,
    },
  })
})
