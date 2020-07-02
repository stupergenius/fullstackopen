const express = require('express')
const Blog = require('../models/blog')

const notesRouter = express.Router()

notesRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})

  response.json(blogs)
})

notesRouter.post('/', async (request, response) => {
  const blog = new Blog(request.body)

  const result = await blog.save()
  response.status(201).json(result)
})

module.exports = notesRouter
