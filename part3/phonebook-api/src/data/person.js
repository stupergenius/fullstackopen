/* eslint-disable no-console */
const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const url = process.env.MONGODB_URI

mongoose.set('useCreateIndex', true)

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
    process.exit(1)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    unique: true,
  },
  number: {
    type: String,
    required: true,
    minlength: 8,
  },
})

personSchema.plugin(uniqueValidator)
personSchema.set('toJSON', {
  transform: (doc, obj) => {
    const newObj = obj
    /* eslint-disable no-underscore-dangle */
    newObj.id = obj._id.toString()
    delete newObj._id
    delete newObj.__v
    /* eslint-enable no-underscore-dangle */
    return newObj
  },
})

const Person = mongoose.model('Person', personSchema)

module.exports = Person
