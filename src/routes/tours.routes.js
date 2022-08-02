const { Router } = require('express')

const {
  getAllToursController,
  getTourController,
  createTourController,
  updateTourController,
  deleteTourController,
  getTourStatsController,
  getMonthlyPlan,
} = require('../controllers/Tours.controller')

const { aliasTopTours } = require('../middlewares/tours.middlewares')
const { protect } = require('../middlewares/auth.middlewares')

const router = Router()

router.route('/').get(protect, getAllToursController).post(createTourController)
router.route('/top-5-cheap').get(aliasTopTours, getAllToursController)
router.route('/tour-stats').get(getTourStatsController)
router.route('/month-plan/:year').get(getMonthlyPlan)

router
  .route('/:id')
  .get(getTourController)
  .patch(updateTourController)
  .delete(deleteTourController)

module.exports = router
