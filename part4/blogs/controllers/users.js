const express = require('express')
const bcrypt = require('bcrypt')
const User = require('../models/user')

const router = express.Router()

router.get('/', async (request, response) => {
  const users = await User.find({})

  response.json(users)
})

router.post('/', async (request, response) => {
  const userData = request.body

  const saltRounds = 8
  userData.password = await bcrypt.hash(userData.password, saltRounds)

  const user = new User(userData)
  const result = await user.save()
  response.status(201).json(result)
})

module.exports = router
