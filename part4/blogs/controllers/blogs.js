const express = require('express')
const Blog = require('../models/blog')

const router = express.Router()

router.get('/', async (request, response) => {
  const blogs = await Blog.find({})

  response.json(blogs)
})

router.post('/', async (request, response) => {
  const blog = new Blog(request.body)

  const result = await blog.save()
  response.status(201).json(result)
})

router.delete('/:id', async (req, res) => {
  const { id } = req.params

  if (id == null || id === '') {
    return res
      .status(400)
      .send({ error: 'malformatted id' })
      .end()
  }

  await Blog.findByIdAndDelete(id)
  res.status(204).end()
})

module.exports = router
