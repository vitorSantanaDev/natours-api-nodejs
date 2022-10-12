const { Router } = require('express')

const {
  getAllToursController,
  getTourController,
  createTourController,
  updateTourController,
  deleteTourController,
  getTourStatsController,
  getMonthlyPlan,
  getTourWithin,
} = require('../controllers/Tours.controller')

const { protect } = require('../middlewares/auth.middlewares')
const { aliasTopTours, restrict } = require('../middlewares/tours.middlewares')

const reviewsRoutes = require('../routes/reviews.routes')

const router = Router()

router.use('/:tourID/reviews', reviewsRoutes)

router
  .route('/')
  .get(getAllToursController)
  .post(protect, restrict('admin', 'lead-guide'), createTourController)

router.route('/top-5-cheap').get(aliasTopTours, getAllToursController)
router.route('/tour-stats').get(getTourStatsController)
router
  .route('/month-plan/:year')
  .get(protect, restrict('admin', 'lead-guide', 'guide'), getMonthlyPlan)

router
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(getTourWithin)

router
  .route('/:id')
  .get(getTourController)
  .patch(protect, restrict('admin', 'lead-guide'), updateTourController)
  .delete(protect, restrict('admin', 'lead-guide'), deleteTourController)

module.exports = router
