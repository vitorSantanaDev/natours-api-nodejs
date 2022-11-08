const { Router } = require('express')

const {
  getTour,
  getAccount,
  getOverview,
  getLoginForm,
  updateUserData,
} = require('../controllers/Views.controller')

const {
  protect,
  checkingIfTheUserIsLoggedIn,
} = require('../middlewares/auth.middlewares')

const router = Router()

router.get('/', checkingIfTheUserIsLoggedIn, getOverview)
router.get('/tour/:slug', checkingIfTheUserIsLoggedIn, getTour)
router.get('/login', checkingIfTheUserIsLoggedIn, getLoginForm)
router.get('/me', protect, getAccount)
router.post('/submit-user-data', protect, updateUserData)

module.exports = router
