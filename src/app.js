const express = require('express')
const morgan = require('morgan')
const dotenv = require('dotenv')

const tourRouter = require('./routes/tours.routes')
const userRouter = require('./routes/users.routes')

const AppError = require('./utils/APIFeatures')
const ErrorController = require('./controllers/Error.controller')

dotenv.config()

const app = express()

app.use(morgan('dev'))
app.use(express.json())
app.use(express.static(`${__dirname}/../public`))

app.use((req, res, next) => {
  req.requestTimeAt = new Date().toISOString()
  next()
})

app.use('/api/v1/tours', tourRouter)
app.use('/api/v1/users', userRouter)

app.all('*', (req, res, next) => {
  const error = new AppError(
    `Can't find ${req.originalUrl} on this server!`,
    404
  )
  next(error)
})

app.use(ErrorController)

module.exports = app
