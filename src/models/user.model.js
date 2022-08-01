const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'PLease tell us your name'],
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  photo: String,
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      validator: function (password) {
        return password === this.password
      },
      message: 'Passwords are not the same',
    },
  },
})

userSchema.pre('save', async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified('password')) return next()
  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12)
  // Delete passwordConfirm field
  this.passwordConfirm = undefined
  next()
})

const USerModel = mongoose.model('UserModel', userSchema)

module.exports = USerModel
