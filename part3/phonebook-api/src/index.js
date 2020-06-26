require('./util/env').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const path = require('path')
const postBodyToken = require('./util/postbody_token')
const personsRouter = require('./routes/persons')
const Person = require('./data/person')

const app = express()
app.use(cors())
app.use(express.json())
app.set('view engine', 'hbs')
app.set('views', path.resolve('src/views'))

morgan.token('post-body', postBodyToken)
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :post-body'))

app.get('/info', (req, res, next) => {
  Person.countDocuments()
    .then(numPersons => res.render('info', { numPersons }))
    .catch(e => next(e))
})

app.use('/api/persons', personsRouter)

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  // eslint-disable-next-line no-console
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }
  if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server running on port ${PORT}`)
})
