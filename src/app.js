const express = require('express')
const morgan = require('morgan')
const rateLimit = require('express-rate-limit')

const tourRouter = require('./routes/tours.routes')
const userRouter = require('./routes/users.routes')

const AppError = require('./utils/appError')
const errorController = require('./controllers/Error.controller')

const app = express()

// Global middlewares
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: `Too many requests from this IP, please try again in an hour!`,
})

app.use('/api', limiter)

app.use(express.json())
app.use(express.static(`${__dirname}/../public`))

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
