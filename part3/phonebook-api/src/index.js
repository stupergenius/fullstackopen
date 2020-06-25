require('./util/env').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const personsRouter = require('./routes/persons')
const db = require('./data/db')

const app = express()
app.use(cors())
app.use(express.json())
app.set('view engine', 'hbs')
app.set('views', __dirname + '/views')

morgan.token('post-body', require('./util/postbody_token'))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :post-body'))

app.get('/info', (req, res) => {
  res.render('info', { numPersons: db.persons.length, now: Date() })
})

app.use('/api/persons', personsRouter)

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})