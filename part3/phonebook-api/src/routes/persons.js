const express = require('express')
const router = express.Router()
const db = require('../data/db')
const Person = require('../data/person')

const handleError = res => e => {
  console.log(e)
  res.status(500).end()
}

router.get('/', (req, res) => {
  Person.find({})
    .then(persons => {
      res.send(persons)
    })
    .catch(handleError(res))
})

router.get('/:id', (req, res) => {
  const id = req.params.id
  if (id == null || id == "") {
    return res
      .status(404)
      .send({error: "invalid id given"})
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
    .catch(handleError)
})

router.post('/', (req, res) => {
  if (!req.body || !req.body.name || !req.body.number) {
    return res
      .status(400)
      .send({ error: 'no body given' })
      .end(handleError(res))
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
        .catch(handleError(res))
    })
    .catch(handleError(res))
})

router.delete('/:id', (req, res) => {
  const id = req.params.id
  if (id == null || id == "") {
    return res
      .status(404)
      .send({error: "invalid id given"})
      .end()
  }

  Person.findByIdAndDelete(id)
    .then(res.status(204).end())
    .catch(handleError(res))
})

module.exports = router