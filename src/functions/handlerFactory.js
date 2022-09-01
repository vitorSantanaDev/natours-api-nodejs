const APIFeatures = require('../utils/APIFeatures')
const AppError = require('../utils/appError')
const catchAsync = require('../utils/catchAsync')

exports.deleteOne = (model) =>
  catchAsync(async (req, res, next) => {
    const { id } = req.params
    const document = await model.findByIdAndDelete(id)

    if (!document) {
      return next(new AppError(`No document found with that ID`, 404))
    }

    res.status(204).json({
      status: 'success',
      data: null,
    })
  })

exports.updateOne = (model) =>
  catchAsync(async (req, res, next) => {
    const { id } = req.params

    const document = await model.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    })

    if (!document) {
      return next(new AppError(`No document found with that ID`, 404))
    }

    res.status(200).json({
      status: 'success',
      data: {
        document,
      },
    })
  })

exports.createOne = (model) =>
  catchAsync(async (req, res, next) => {
    const document = await model.create(req.body)

    res.status(200).json({
      status: 'success',
      data: {
        document,
      },
    })
  })

exports.getOne = (model, populateOptions) =>
  catchAsync(async (req, res, next) => {
    const { id: documentID } = req.params

    let query = model.findById(documentID)

    if (populateOptions) query = query.populate(populateOptions)

    const document = await query

    if (!document) {
      return next(new AppError(`No document found with that ID`, 404))
    }

    res.status(200).json({
      status: 'success',
      data: {
        document,
      },
    })
  })

exports.getAll = (model) =>
  catchAsync(async (req, res, next) => {
    const { tourID: documentID } = req.params

    let filter = {}
    if (documentID) filter = { tour: documentID }

    const features = new APIFeatures(model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate()

    const documents = await features.query

    res.status(200).json({
      status: 'success',
      results: documents.length,
      requestTimeAte: req.requestTimeAt,
      data: {
        documents,
      },
    })
  })
