const express = require('express')
const router = express.Router()
const db = require('../data/db')

const generateId = () => Math.round(Math.random() * 1000000000)

router.get('/', (req, res) => {
  res.send(db.persons)
})

router.get('/:id', (req, res) => {
  const id = Number(req.params.id)
  if (isNaN(id)) {
    return res.status(404).end()
  }

  const person = db.persons.find(p => p.id === id)
  if (!person) {
    return res.status(404).end()
  }

  res.send(person)
})

router.post('/', (req, res) => {
  if (!req.body || !req.body.name || !req.body.number) {
    return res
      .status(400)
      .send({ error: 'no body given' })
      .end()
  }

  if (db.persons.some(p => p.name === req.body.name)) {
    return res
      .status(400)
      .send({ error: 'name must be unique' })
      .end()
  }

  const newPerson = {
    name: req.body.name,
    number: req.body.number,
    id: generateId()
  }
  db.persons.push(newPerson)

  res.send(newPerson)
})

router.delete('/:id', (req, res) => {
  const id = Number(req.params.id)
  if (isNaN(id)) {
    return res.status(204).end()
  }

  db.persons = db.persons.filter(p => p.id !== id)
  res.status(204).end()
})

module.exports = router