const mongoose = require('mongoose')
const TourModel = require('./tour.model')

const reviewSchema = mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review can not be empty'],
    },
    rating: {
      type: Number,
      default: 1,
      min: 1,
      max: 5,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'TourModel',
      required: [true, 'Review must belong to a tour.'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'UserModel',
      required: [true, 'Review must belong to a user'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

reviewSchema.index({ tour: 1, user: 1 }, { unique: true })

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name photo',
  })
  next()
})

reviewSchema.statics.calcAverageRatings = async function (tourID) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourID },
    },
    {
      $group: {
        _id: '$tour',
        numberRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ])

  if (stats.length > 0) {
    await TourModel.findByIdAndUpdate(tourID, {
      ratingsQuantity: stats[0].numberRating,
      ratingsAverage: stats[0].avgRating,
    })
  } else {
    await TourModel.findByIdAndUpdate(tourID, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5,
    })
  }
}

reviewSchema.post('save', function () {
  // this points to current review
  this.constructor.calcAverageRatings(this.tour)
})

// findOneAndUpdate
// findOneAndDelete
reviewSchema.pre(/^findOneAnd/, async function (next) {
  this.r = await this.findOne()
  console.log(this.r)
  next()
})

reviewSchema.post(/^findOneAnd/, async function () {
  // await this.findOne(); does NOT work here, query has already executed
  await this.r.constructor.calcAverageRatings(this.r.tour)
})

const ReviewModel = mongoose.model('ReviewModel', reviewSchema)

module.exports = ReviewModel
