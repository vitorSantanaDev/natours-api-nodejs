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

router.use(protect)

router
  .route('/')
  .get(getAllReviewsController)
  .post(restrict('user'), setTourUserIDsMiddleware, createReviewController)

router
  .route('/:id')
  .get(getReviewController)
  .delete(restrict('user', 'admin'), deleteReviewController)
  .patch(restrict('user', 'admin'), updateReviewController)

module.exports = router
