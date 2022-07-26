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
  getDistances,
} = require('../controllers/Tours.controller')

const { protect } = require('../middlewares/auth.middlewares')
const { aliasTopTours, restrict } = require('../middlewares/tours.middlewares')
const {
  resizeTourImages,
  uploadTourImages,
} = require('../middlewares/upload.middlewares')

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

router.route('/distances/:latlng/unit/:unit').get(getDistances)

router
  .route('/:id')
  .get(getTourController)
  .patch(
    protect,
    restrict('admin', 'lead-guide'),
    uploadTourImages,
    resizeTourImages,
    updateTourController
  )
  .delete(protect, restrict('admin', 'lead-guide'), deleteTourController)

module.exports = router
