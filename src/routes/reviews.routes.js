const { Router } = require('express')

const {
  getAllReviewsController,
  createReviewController,
  deleteReviewController,
  updateReviewController,
  setTourUserIDsMiddleware,
  getReviewController,
} = require('../controllers/Review.controller')

const { protect } = require('../middlewares/auth.middlewares')
const { restrict } = require('../middlewares/tours.middlewares')

const router = Router({ mergeParams: true })

router
  .route('/')
  .get(protect, getAllReviewsController)
  .post(
    protect,
    restrict('user'),
    setTourUserIDsMiddleware,
    createReviewController
  )

router
  .route('/:id')
  .get(getReviewController)
  .delete(protect, restrict('user'), deleteReviewController)
  .patch(protect, restrict('user'), updateReviewController)

module.exports = router
