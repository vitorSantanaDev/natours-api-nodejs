const AppError = require('../utils/appError')
const catchAsync = require('../utils/catchAsync')

exports.aliasTopTours = catchAsync(async (req, res, next) => {
  req.query.limit = '5'
  req.query.sort = '-ratingsAverage,price'
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty'
  next()
})

exports.restrict = (...roles) => {
  return async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(`You do not have permission to perform this action`, 403)
      )
    }
    next()
  }
}
