import React, { useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  newBlogAction,
  likeAction,
  deleteBlogAction,
} from '../reducers/blogReducer'
import Blog from './Blog'
import BlogForm from './BlogForm'
import Togglable from './Togglable'
import { showSuccessNotificationAction, showErrorNotificationAction } from '../reducers/notificationReducer'

const BlogList = () => {
  const dispatch = useDispatch()
  const blogs = useSelector(state => state.blogs)
  const user = useSelector(state => state.user)
  const blogFormRef = useRef()

  const isUserOwner = blog => blog.user && blog.user.username === user.username

  const handleSubmitBlog = async (newBlog) => {
    try {
      dispatch(newBlogAction(newBlog))

      blogFormRef.current.toggleVisibility()
      dispatch(showSuccessNotificationAction(`a new blog ${newBlog.title} by ${newBlog.author} added`))
    } catch (exception) {
      dispatch(showErrorNotificationAction(`Error creating blog: ${exception.message}`))
    }
  }

  const handleLikeBlog = async (blog) => {
    try {
      dispatch(likeAction(blog))
    } catch (exception) {
      dispatch(showErrorNotificationAction(`Error liking blog: ${exception.message}`))
    }
  }

  const handleDeleteBlog = async (blog) => {
    if (window.confirm(`Delete ${blog.title} by ${blog.author}?`)) {
      try {
        dispatch(deleteBlogAction(blog.id))
        dispatch(showSuccessNotificationAction(`Deleted blog: ${blog.title}`))
      } catch (exception) {
        dispatch(showErrorNotificationAction(`Error deleting blog: ${blog.title}`))
      }
    }
  }

  return (
    <>
      <Togglable buttonLabel="new blog" ref={blogFormRef}>
        <BlogForm createBlog={handleSubmitBlog} />
      </Togglable>
      <br />
      {blogs.map(blog => (
        <Blog
          key={blog.id}
          blog={blog}
          onLike={handleLikeBlog}
          onRemove={handleDeleteBlog}
          showRemove={isUserOwner(blog)}
        />
      ))}
    </>
  )
}

export default BlogList
