import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { initBlogCommentsAction } from '../../reducers/blogReducer'
import CommentForm from './CommentForm'

const BlogComments = ({ blog }) => {
  const dispatch = useDispatch()

  useEffect(() => {
    if (typeof blog.comments === 'undefined') {
      dispatch(initBlogCommentsAction(blog.id))
    }
  }, [dispatch, blog])

  if (!blog.comments) return null

  return (
    <>
      <h3>comments</h3>
      <CommentForm blog={blog} />
      {blog.comments.length === 0
        ? <p>None yet!</p>
        : (
          <ul>
            {blog.comments.map(comment => (
              <li key={comment.id}>{comment.content}</li>
            ))}
          </ul>
        )}
    </>
  )
}

export default BlogComments
