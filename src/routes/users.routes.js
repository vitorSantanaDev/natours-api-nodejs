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
  signUpController,
  loginController,
  forgotPasswordController,
  resetPasswordController,
  updatePasswordController,
} = require('../controllers/Auth.controller')

const { getMe } = require('../middlewares/users.middlewares')
const { protect } = require('../middlewares/auth.middlewares')
const { restrict } = require('../middlewares/tours.middlewares')

const router = Router()

router.post('/signup', signUpController)
router.post('/login', loginController)

router.get('/me', protect, getMe, getUserController)
router.post('/forgot-password', forgotPasswordController)
router.patch('/reset-password/:token', resetPasswordController)
router.patch('/update-password', protect, updatePasswordController)
router.patch('/update-current-user', protect, updateCurrentUserController)
router.delete('/delete-current-user', protect, deleteCurrentUserController)

router.route('/').get(getAllUsersController).post(createUserController)

router
  .route('/:id')
  .get(getUserController)
  .patch(protect, restrict('admin'), updateUserController)
  .delete(protect, restrict('admin'), deleteUserController)

module.exports = router
