const { Router } = require('express')

const {
  getTour,
  getOverview,
  getLoginForm,
} = require('../controllers/Views.controller')

const {
  checkingIfTheUserIsLoggedIn,
} = require('../middlewares/auth.middlewares')

const router = Router()

router.use(checkingIfTheUserIsLoggedIn)

router.get('/', getOverview)
router.get('/tour/:slug', getTour)
router.get('/login', getLoginForm)

module.exports = router
