import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useHistory } from 'react-router-dom'
import {
  likeAction,
  deleteBlogAction,
} from '../reducers/blogReducer'
import { showSuccessNotificationAction, showErrorNotificationAction } from '../reducers/notificationReducer'
import BlogComments from './BlogComments'

const BlogDetails = () => {
  const dispatch = useDispatch()
  const history = useHistory()

  const blogId = useParams().id
  const blogs = useSelector(state => state.blogs)
  const blog = blogs.find(b => b.id === blogId)
  const user = useSelector(state => state.user)

  if (!blog) return null

  const isUserOwner = blog.user && blog.user.username === user.username
  const formattedLikes = `${blog.likes} like${blog.likes !== 1 ? 's' : ''}`

  const handleLikeBlog = async () => {
    try {
      dispatch(likeAction(blog))
    } catch (exception) {
      dispatch(showErrorNotificationAction(`Error liking blog: ${exception.message}`))
    }
  }

  const handleDeleteBlog = async () => {
    if (window.confirm(`Delete ${blog.title} by ${blog.author}?`)) {
      try {
        dispatch(deleteBlogAction(blog.id))
        dispatch(showSuccessNotificationAction(`Deleted blog: ${blog.title}`))
        history.push('/')
      } catch (exception) {
        dispatch(showErrorNotificationAction(`Error deleting blog: ${blog.title}`))
      }
    }
  }

  return (
    <>
      <h2>{blog.title}</h2>
      <p>
        <a href={blog.info}>{blog.info}</a>
        {formattedLikes} <button type="button" onClick={handleLikeBlog}>like</button> <br />
        added by {blog.user ? blog.user.name : 'Unknown'} <br />
        {isUserOwner && <button type="button" onClick={handleDeleteBlog}>remove</button>}
      </p>
      <BlogComments blog={blog} />
    </>
  )
}

export default BlogDetails
