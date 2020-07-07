const mongoose = require('mongoose')
const { toJson } = require('../utils/mongo')

const userSchema = mongoose.Schema({
  username: {
    type: String,
  },
  password: {
    type: String,
  },
  name: {
    type: String,
  },
})

const User = mongoose.model('User', userSchema)

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    const user = toJson(document, returnedObject)
    delete user.password
    return user
  },
})

module.exports = User
