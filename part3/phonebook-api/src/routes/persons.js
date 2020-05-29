const express = require('express')
const router = express.Router()
const db = require('../data/db')

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

router.delete('/:id', (req, res) => {
  const id = Number(req.params.id)
  if (isNaN(id)) {
    return res.status(204).end()
  }

  db.persons = db.persons.filter(p => p.id !== id)
  res.status(204).end()
})

module.exports = router