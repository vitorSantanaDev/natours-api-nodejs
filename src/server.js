const mongoose = require('mongoose')
const dotenv = require('dotenv')

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...')
  console.log(err.name, err.message)
  process.exit(1)
})

dotenv.config({ path: './config.env' })

const app = require('./app')

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
)

mongoose.connect(DB).then(() => {
  console.debug('DB connection successfuly 🚀')
})

const port = process.env.PORT || 8000

const server = app.listen(port, () => {
  console.info(`App running on port ${port} 🔥`)
})

process.on(`unhandledRejection`, (err) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...')
  console.log(err.name, err.message)
  server.close(() => {
    process.exit(1)
  })
})
