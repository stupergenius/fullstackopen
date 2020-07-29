import React, { useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { newBlogAction } from '../reducers/blogReducer'
import BlogForm from './BlogForm'
import Togglable from './Togglable'
import { showSuccessNotificationAction, showErrorNotificationAction } from '../reducers/notificationReducer'

const BlogList = () => {
  const dispatch = useDispatch()
  const blogs = useSelector(state => state.blogs)
  const blogFormRef = useRef()

  const handleSubmitBlog = async (newBlog) => {
    try {
      dispatch(newBlogAction(newBlog))

      blogFormRef.current.toggleVisibility()
      dispatch(showSuccessNotificationAction(`a new blog ${newBlog.title} by ${newBlog.author} added`))
    } catch (exception) {
      dispatch(showErrorNotificationAction(`Error creating blog: ${exception.message}`))
    }
  }

  const blogStyle = {
    padding: 10,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  return (
    <>
      <Togglable buttonLabel="new blog" ref={blogFormRef}>
        <BlogForm createBlog={handleSubmitBlog} />
      </Togglable>
      <br />
      {blogs.map(blog => (
        <div key={blog.id} style={blogStyle}>
          <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
        </div>
      ))}
    </>
  )
}

export default BlogList
