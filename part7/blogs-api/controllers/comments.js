const router = require('express').Router()
const Blog = require('../models/blog')
const Comment = require('../models/comment')

router.get('/', async (request, response) => {
  const comments = await Comment.find({ blog: request.blogId })
  response.send(comments).end()
})

router.post('/', async (request, response) => {
  if (!request.body || !request.body.content) {
    return response.status(400).send({ error: 'no body' }).end()
  }

  const blog = await Blog.findById(request.blogId)
  if (!blog) {
    return response.status(400).send({ error: 'invalid blog id' }).end()
  }

  const comment = new Comment({
    content: request.body.content,
    blog: blog._id,
  })
  const newComment = await comment.save()

  response.status(201).send(newComment).end()
})

module.exports = router
