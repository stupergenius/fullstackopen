const mongoose = require('mongoose')

const blogSchema = mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: {
    type: Number,
    default: 0,
  },
})

const Blog = mongoose.model('Blog', blogSchema)

blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    const transformed = returnedObject
    transformed.id = transformed._id.toString()
    delete transformed._id
    delete transformed.__v
    return transformed
  },
})

module.exports = Blog
