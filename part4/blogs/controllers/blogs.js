const express = require('express')
const tokenizer = require('../utils/tokenizer')
const Blog = require('../models/blog')
const User = require('../models/user')

const router = express.Router()

const getTokenFrom = (request) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)
  }
  return null
}

router.get('/', async (request, response) => {
  const blogs = await Blog
    .find({})
    .populate('user', { username: 1, name: 1, id: 1 })

  response.json(blogs)
})

router.post('/', async (request, response) => {
  const blogData = request.body

  const token = getTokenFrom(request)
  const tokenData = await tokenizer.verify(token)
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

  await Blog.findByIdAndDelete(id)
  res.status(204).end()
})

module.exports = router
