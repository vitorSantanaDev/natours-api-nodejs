const { Router } = require('express')

const {
  getAllUsersController,
  getUserController,
  createUserController,
  updateUserController,
  deleteUserController,
} = require('../controllers/Users.controller')

const router = Router()

router.route('/').get(getAllUsersController).post(createUserController)

router
  .route('/:id')
  .get(getUserController)
  .patch(updateUserController)
  .delete(deleteUserController)

module.exports = router
