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
} = require('../controllers/Auth.controller')

const router = Router()

router.post('/signup', signUpController)
router.post('/login', loginController)

router.route('/').get(getAllUsersController).post(createUserController)

router
  .route('/:id')
  .get(getUserController)
  .patch(updateUserController)
  .delete(deleteUserController)

module.exports = router
