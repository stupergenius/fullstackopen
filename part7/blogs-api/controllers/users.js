const express = require('express')
const crypto = require('../utils/crypto')
const User = require('../models/user')

const router = express.Router()

router.get('/', async (request, response) => {
  const users = await User
    .find({})
    .populate('blogs', {
      title: 1,
      author: 1,
      url: 1,
      id: 1,
    })

  response.json(users)
})

router.post('/', async (request, response) => {
  const userData = request.body
  if (typeof userData.password !== 'string') {
    return response
      .status(400)
      .send({ error: 'User validation failed: password: Path `password` is required' })
  }
  if (userData.password.length < 3) {
    return response
      .status(400)
      .send({ error: `User validation failed: password: Path \`password\` (\`${userData.password}\`) is shorter than the minimum allowed length (3).` })
  }

  userData.password = await crypto.hash(userData.password)
  const user = new User(userData)

  const result = await user.save()
  response.status(201).json(result)
})

module.exports = router
