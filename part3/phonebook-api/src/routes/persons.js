const express = require('express')
const router = express.Router()
const db = require('../data/db')
const Person = require('../data/person')

router.get('/', (req, res, next) => {
  Person.find({})
    .then(persons => {
      res.send(persons)
    })
    .catch(e => next(e))
})

router.get('/:id', (req, res, next) => {
  const id = req.params.id
  if (id == null || id == "") {
    return res
      .status(404)
      .send({error: "malformatted id"})
      .end()
  }

  const person = Person.findById(id)
    .then(person => {
      if (person) {
        res.send(person)
      } else {
        res.status(404).end()
      }
    })
    .catch(e => next(e))
})

router.post('/', (req, res, next) => {
  if (!req.body || !req.body.name || !req.body.number) {
    return res
      .status(400)
      .send({ error: 'no body given' })
      .end()
  }

  Person.countDocuments({name: req.body.name})
    .then(count => {
      if (count > 0) {
        return res
          .status(400)
          .send({ error: 'name must be unique' })
          .end()
      }

      const person = new Person({name: req.body.name, number: req.body.number})
      person.save()
        .then(result => res.send(result))
        .catch(e => next(e))
    })
    .catch(e => next(e))
})

router.delete('/:id', (req, res, next) => {
  const id = req.params.id
  if (id == null || id == "") {
    return res
      .status(404)
      .send({error: "malformatted id"})
      .end()
  }

  Person.findByIdAndDelete(id)
    .then(res.status(204).end())
    .catch(e => next(e))
})

module.exports = router