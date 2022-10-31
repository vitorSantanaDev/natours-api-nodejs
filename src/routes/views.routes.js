const { Router } = require('express')

const { getOverview, getTour } = require('../controllers/Views.controller')

const router = Router()

router.get('/', getOverview)
router.get('/tour/:slug', getTour)

module.exports = router
