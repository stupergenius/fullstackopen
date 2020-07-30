import React, { useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { newBlogAction } from '../../reducers/blogReducer'
import BlogForm from './BlogForm'
import Togglable from '../common/Togglable'

const BlogList = () => {
  const dispatch = useDispatch()
  const blogs = useSelector(state => state.blogs)
  const blogFormRef = useRef()

  const handleSubmitBlog = async (newBlog) => {
    dispatch(newBlogAction(newBlog))
    blogFormRef.current.toggleVisibility()
  }

  return (
    <>
      <Togglable buttonLabel="new blog" ref={blogFormRef}>
        <BlogForm createBlog={handleSubmitBlog} />
      </Togglable>
      <br />

      <ul className="list-group list-group-flush">
        {blogs.map(blog => (
          <li key={blog.id} className="list-group-item">
            <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
          </li>
        ))}
      </ul>
    </>
  )
}

export default BlogList
