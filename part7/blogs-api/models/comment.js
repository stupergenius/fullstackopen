const mongoose = require('mongoose')
const { toJson } = require('../utils/mongo')

const commentSchema = mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  blog: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Blog',
  },
})

const Comment = mongoose.model('Comment', commentSchema)

commentSchema.set('toJSON', {
  transform: toJson,
})

module.exports = Comment
