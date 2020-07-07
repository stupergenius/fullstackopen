const express = require('express')
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
  const user = await User.findOne({})

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
