const mongoose = require('mongoose')

const init = () => {
  mongoose.set('useFindAndModify', false)
  mongoose.set('useCreateIndex', true)

  console.log('connecting to', process.env.MONGODB_URI)

  mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
      console.log('connected to MongoDB')
    })
    .catch((error) => {
      console.log('error connection to MongoDB:', error.message)
    })
}

module.exports = { init }
