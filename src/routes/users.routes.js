const { Router } = require('express')

const {
  getAllUsersController,
  getUserController,
  createUserController,
  updateUserController,
  deleteUserController,
} = require('../controllers/Users.controller')

const {
  signUpController,
  loginController,
  forgotPassword,
  resetPassword,
  updatePassword,
} = require('../controllers/Auth.controller')

const { protect } = require('../middlewares/auth.middlewares')

const router = Router()

router.post('/signup', signUpController)
router.post('/login', loginController)

router.post('/forgot-password', forgotPassword)
router.patch('/reset-password/:token', resetPassword)
router.patch('/update-password', protect, updatePassword)

router.route('/').get(getAllUsersController).post(createUserController)

router
  .route('/:id')
  .get(getUserController)
  .patch(updateUserController)
  .delete(deleteUserController)

module.exports = router
