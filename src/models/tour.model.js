const mongoose = require('mongoose')
const slugify = require('slugify')
// const validator = require('validator')

// const UserModel = require('../models/user.model')

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: [true, 'A tour must have a name'],
      unique: true,
      // validate: [validator.isAlpha, 'Tour name must only contain characters'],
    },
    slug: String,
    duration: {
      type: Number,
      require: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size'],
    },
    difficulty: {
      type: String,
      require: [true, 'A tour must have a diffculty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either: easy, medium, difficult',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.9,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be above 5.0'],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      require: true,
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (value) {
          // this only points to current doc on New document creation
          return value < this.price
        },
        message: 'Discount price ({VALUE}) shold be below regular price',
      },
    },
    summary: { type: String, trim: true },
    description: {
      type: String,
      trim: true,
      require: [true, 'A tour must have a description'],
    },
    imageCover: {
      type: String,
      require: [true, 'A tour must have a cover image'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
    startLocation: {
      // GeoJSON
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: [{ type: mongoose.Schema.ObjectId, ref: 'UserModel' }],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7
})

// DOCUMENT MIDDLEWARE: runs before .save() and .create()
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true })
  next()
})

// tourSchema.pre('save', async function (next) {
//   const guidesPromises = this.guides.map(
//     async (id) => await UserModel.findById(id)
//   )
//   this.guides = await Promise.all(guidesPromises)
//   next()
// })

// tourSchema.post('save', function (doc, next) {
//   console.log({ doc })
//   next()
// })

// QUERY MIDDLEWARE
// tourSchema.pre('find', function (next) {
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } })
  this.start = Date.now()
  next()
})

tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangedAt',
  })
  next()
})

//AGGREGATION MIDDLEWARE
tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } })
  console.log(this.pipeline())
  next()
})

tourSchema.post(/^find/, function (docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds`)
  console.log({ docs })
  next()
})

const TourModel = mongoose.model('TourModel', tourSchema)

module.exports = TourModel
