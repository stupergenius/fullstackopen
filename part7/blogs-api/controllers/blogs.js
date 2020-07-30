const express = require('express')
const tokenizer = require('../utils/tokenizer')
const commentsRouter = require('./comments')
const Blog = require('../models/blog')
const User = require('../models/user')

const router = express.Router()

router.get('/', async (request, response) => {
  const blogs = await Blog
    .find({})
    .populate('user', { username: 1, name: 1, id: 1 })

  response.json(blogs)
})

router.post('/', async (request, response) => {
  const blogData = request.body

  const tokenData = await tokenizer.verify(request.token)
  if (!tokenData || !tokenData.id) {
    return response.status(401).send({ error: 'token missing or invalid' })
  }

  const user = await User.findById(tokenData.id)
  blogData.user = user._id
  const blog = new Blog(blogData)

  const newBlog = await blog.save()
  user.blogs = user.blogs.concat(newBlog._id)
  await user.save()

  response.status(201).json(newBlog)
})

router.put('/:id', async (req, res) => {
  const { id } = req.params

  const person = await Blog.findByIdAndUpdate(id, req.body, { new: true, runValidators: true })
  res.send(person)
})

router.delete('/:id', async (req, res) => {
  const { id } = req.params

  const tokenData = await tokenizer.verify(req.token)
  if (!tokenData || !tokenData.id) {
    return res.status(401).send({ error: 'token missing or invalid' })
  }

  const blog = await Blog.findById(id)
  if (!blog) {
    return res.status(204).end()
  }

  if (!blog.user || blog.user.toString() !== tokenData.id) {
    return res.status(403).send({ error: 'insufficient permission' })
  }

  await Blog.findByIdAndDelete(id)
  res.status(204).end()
})

router.use('/:id/comments', (req, res, next) => {
  req.blogId = req.params.id
  next()
}, commentsRouter)

module.exports = router
