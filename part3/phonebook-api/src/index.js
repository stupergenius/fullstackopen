const express = require('express')
const morgan = require('morgan')
const personsRouter = require('./routes/persons')
const db = require('./data/db')

const app = express()
app.use(morgan(app.get('env') === 'production' ? 'common' : 'dev'))
app.use(express.json())
app.set('view engine', 'hbs')
app.set('views', __dirname + '/views')

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