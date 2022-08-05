const { Router } = require('express')

const {
  getAllUsersController,
  getUserController,
  createUserController,
  updateUserController,
  deleteUserController,
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

const { protect } = require('../middlewares/auth.middlewares')

const router = Router()

router.post('/signup', signUpController)
router.post('/login', loginController)

router.post('/forgot-password', forgotPasswordController)
router.patch('/reset-password/:token', resetPasswordController)
router.patch('/update-password', protect, updatePasswordController)
router.patch('/update-current-user', protect, updateCurrentUserController)
router.delete('/delete-current-user', protect, deleteCurrentUserController)

router.route('/').get(getAllUsersController).post(createUserController)

router
  .route('/:id')
  .get(getUserController)
  .patch(updateUserController)
  .delete(deleteUserController)

module.exports = router
