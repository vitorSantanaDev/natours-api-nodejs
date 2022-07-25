const mongoose = require('mongoose')

const app = require('./app')

const port = process.env.PORT

mongoose
  .connect(
    `mongodb+srv://${process.env.USERNAME_DATABASE}:${process.env.PASSWORD_DATABASE}@${process.env.DATABASE_HOST}/${process.env.DATABASE_NAME}?retryWrites=true&w=majority`
  )
  .then(() => {
    console.debug('DB connection successfuly 🚀')
  })

app.listen(port, () => {
  console.info(`App running on port ${port} 🔥`)
})
