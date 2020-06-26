const express = require('express')
const Person = require('../data/person')

const router = express.Router()

router.get('/', (req, res, next) => {
  Person.find({})
    .then(persons => res.send(persons))
    .catch(e => next(e))
})

router.get('/:id', (req, res, next) => {
  const { id } = req.params

  Person.findById(id)
    .then((person) => {
      if (person) {
        res.send(person)
      } else {
        res.status(404).end()
      }
    })
    .catch(e => next(e))
})

router.post('/', (req, res, next) => {
  const personData = { name: req.body.name, number: req.body.number }
  const person = new Person(personData)
  person.save()
    .then(saved => res.send(saved))
    .catch(e => next(e))
})

router.put('/:id', (req, res, next) => {
  const { id } = req.params

  if (id == null || id === '') {
    return res
      .status(404)
      .send({ error: 'malformatted id' })
      .end()
  }

  if (!req.body || !req.body.name || !req.body.number) {
    return res
      .status(400)
      .send({ error: 'no body given' })
      .end()
  }

  const personData = { name: req.body.name, number: req.body.number }
  Person.findByIdAndUpdate(id, personData, { new: true, runValidators: true })
    .then(person => res.send(person))
    .catch(e => next(e))
})

router.delete('/:id', (req, res, next) => {
  const { id } = req.params

  if (id == null || id === '') {
    return res
      .status(404)
      .send({ error: 'malformatted id' })
      .end()
  }

  Person.findByIdAndDelete(id)
    .then(() => res.status(204).end())
    .catch(e => next(e))
})

module.exports = router
