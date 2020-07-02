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

router.put('/:id', async (req, res) => {
  const { id } = req.params

  const person = await Blog.findByIdAndUpdate(id, req.body, { new: true, runValidators: true })
  res.send(person)
})

router.delete('/:id', async (req, res) => {
  const { id } = req.params

  await Blog.findByIdAndDelete(id)
  res.status(204).end()
})

module.exports = router
