const multer = require('multer')
const sharp = require('sharp')

const AppError = require('../utils/appError')

// const multerStorage = multer.diskStorage({
//   destination: (_, __, callback) => {
//     callback(null, 'public/img/users')
//   },
//   filename: (req, file, callback) => {
//     const extention = file.mimetype.split('/')[1]
//     callback(null, `user-${req.user.id}-${Date.now()}.${extention}`)
//   },
// })

const multerStorage = multer.memoryStorage()

const multerFilter = (_, file, callback) => {
  if (file.mimetype.startsWith('image')) {
    callback(null, true)
  } else {
    callback(
      new AppError(`Not an image! Please upload only images`, 400),
      false
    )
  }
}

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
})

exports.uploadUserPhoto = upload.single('photo')

exports.resizeUserPhoto = (req, res, next) => {
  if (!req.file) return next()

  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`

  sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`)

  next()
}
