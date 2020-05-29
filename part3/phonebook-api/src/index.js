const express = require('express')
const personsRouter = require('./routes/persons')
const db = require('./data/db')

const app = express()
app.use(express.json())
app.set('view engine', 'hbs')
app.set('views', __dirname + '/views')

app.get('/info', (req, res) => {
  res.render('info', { numPersons: db.persons.length, now: Date() })
})

app.use('/api/persons', personsRouter)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})