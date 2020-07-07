const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const { toJson } = require('../utils/mongo')

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 3,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
  },
})
userSchema.plugin(uniqueValidator)

const User = mongoose.model('User', userSchema)

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    const user = toJson(document, returnedObject)
    delete user.password
    return user
  },
})

module.exports = User
