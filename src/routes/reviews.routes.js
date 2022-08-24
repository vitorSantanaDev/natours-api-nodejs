const { Router } = require('express')

const {
  getAllReviewsController,
  createReviewController,
} = require('../controllers/Review.controller')

const { protect } = require('../middlewares/auth.middlewares')
const { restrict } = require('../middlewares/tours.middlewares')

const router = Router({ mergeParams: true })

router
  .route('/')
  .get(protect, getAllReviewsController)
  .post(protect, restrict('user'), createReviewController)

module.exports = router
