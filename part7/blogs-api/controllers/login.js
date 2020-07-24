const express = require('express')
const crypto = require('../utils/crypto')
const tokenizer = require('../utils/tokenizer')
const User = require('../models/user')

const router = express.Router()

router.post('/', async (request, response) => {
  const userData = request.body

  const user = await User.findOne({ username: userData.username })
  const passwordCorrect = user === null
    ? false
    : await crypto.compare(userData.password, user.password)

  if (!passwordCorrect) {
    return response
      .status(401)
      .send({ error: 'invalid username or password' })
  }

  const token = await tokenizer.tokenize({
    username: user.username,
    id: user._id,
  })

  response
    .status(200)
    .send({
      token,
      username: user.username,
      name: user.name,
    })
})

module.exports = router
