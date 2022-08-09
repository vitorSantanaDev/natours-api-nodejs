const express = require('express')
const morgan = require('morgan')
const rateLimit = require('express-rate-limit')
const helmet = require('helmet')
const mongoSanitize = require('express-mongo-sanitize')
const xss = require('xss-clean')
const hpp = require('hpp')

const tourRouter = require('./routes/tours.routes')
const userRouter = require('./routes/users.routes')

const AppError = require('./utils/appError')
const errorController = require('./controllers/Error.controller')

const app = express()

// Global middlewares

// Set security HTTP headers
app.use(helmet())

// Development looging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

// limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: `Too many requests from this IP, please try again in an hour!`,
})

app.use('/api', limiter)

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }))

// Data sanatization against NoSQL query injection
app.use(mongoSanitize())

// Data sanatization against XSS
app.use(xss())

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
)

// Serving static files
app.use(express.static(`${__dirname}/../public`))

// Request time middleware
app.use((req, res, next) => {
  req.requestTimeAt = new Date().toISOString()
  next()
})

app.use('/api/v1/tours', tourRouter)
app.use('/api/v1/users', userRouter)

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404))
})

app.use(errorController)

module.exports = app
