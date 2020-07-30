import React from 'react'
import { useDispatch } from 'react-redux'
import { addBlogCommentAction } from '../../reducers/blogReducer'

const CommentForm = ({ blog }) => {
  const dispatch = useDispatch()

  const handleSubmit = (event) => {
    event.preventDefault()
    const comment = event.target.comment.value
    if (typeof comment !== 'string' || comment.length === 0) return

    dispatch(addBlogCommentAction(blog.id, comment))
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="comment" placeholder="new comment" /> &nbsp;
      <button type="submit">add comment</button>
    </form>
  )
}

export default CommentForm
