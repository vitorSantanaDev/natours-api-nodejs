const { Router } = require('express')

const {
  getUserController,
  createUserController,
  updateUserController,
  deleteUserController,
  getAllUsersController,
  updateCurrentUserController,
  deleteCurrentUserController,
} = require('../controllers/Users.controller')

const {
  loginController,
  logoutController,
  signUpController,
  forgotPasswordController,
  resetPasswordController,
  updatePasswordController,
} = require('../controllers/Auth.controller')

const { getMe } = require('../middlewares/users.middlewares')
const { protect } = require('../middlewares/auth.middlewares')
const { restrict } = require('../middlewares/tours.middlewares')
const {
  uploadUserPhoto,
  resizeUserPhoto,
} = require('../middlewares/upload.middlewares')

const router = Router()

router.post('/signup', signUpController)
router.post('/login', loginController)
router.get('/logout', logoutController)

// protect all routes after this middleware
router.use(protect)

router.get('/me', getMe, getUserController)
router.post('/forgot-password', forgotPasswordController)
router.patch('/reset-password/:token', resetPasswordController)
router.patch('/update-password', updatePasswordController)
router.patch(
  '/update-current-user',
  uploadUserPhoto,
  resizeUserPhoto,
  updateCurrentUserController
)
router.delete('/delete-current-user', deleteCurrentUserController)

router.use(restrict('admin'))

router.route('/').get(getAllUsersController).post(createUserController)
router
  .route('/:id')
  .get(getUserController)
  .patch(updateUserController)
  .delete(deleteUserController)

module.exports = router
