import React, { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import { initBlogsAction, newBlogAction, likeAction, deleteBlogAction } from './reducers/blogReducer'
import { showNotificationAction } from './reducers/notificationReducer'

const App = () => {
  const dispatch = useDispatch()
  const blogs = useSelector(state => state.blogs.sort((a, b) => (a.likes > b.likes ? -1 : 1)))
  const notification = useSelector(state => state.notification)
  const [user, setUser] = useState(null)
  const blogFormRef = useRef()

  const isUserOwner = blog => blog.user && blog.user.username === user.username

  useEffect(() => {
    dispatch(initBlogsAction())
  }, [dispatch])

  useEffect(() => {
    const storedUser = window.localStorage.getItem('user')
    if (!storedUser) return

    const existingUser = JSON.parse(storedUser)
    setUser(existingUser)
    blogService.setToken(existingUser.token)
  }, [])

  const showSuccess = (message) => {
    dispatch(showNotificationAction('success', message, 3))
  }

  const showError = (message) => {
    dispatch(showNotificationAction('error', message, 3))
  }

  const handleLogin = async (username, password) => {
    try {
      const newUser = await loginService.login(username, password)

      setUser(newUser)
      window.localStorage.setItem('user', JSON.stringify(newUser))
      blogService.setToken(newUser.token)
    } catch (exception) {
      showError('Wrong Credentials')
    }
  }

  const handleLogout = () => {
    setUser(null)
    window.localStorage.removeItem('user')
  }

  const handleSubmitBlog = async (newBlog) => {
    try {
      dispatch(newBlogAction(newBlog))

      blogFormRef.current.toggleVisibility()
      showSuccess(`a new blog ${newBlog.title} by ${newBlog.author} added`)
    } catch (exception) {
      showError(`Error creating blog: ${exception.message}`)
    }
  }

  const handleLikeBlog = async (blog) => {
    try {
      dispatch(likeAction(blog))
    } catch (exception) {
      showError(`Error liking blog: ${exception.message}`)
    }
  }

  const handleDeleteBlog = async (blog) => {
    if (window.confirm(`Delete ${blog.title} by ${blog.author}?`)) {
      try {
        dispatch(deleteBlogAction(blog.id))
        showSuccess(`Deleted blog: ${blog.title}`)
      } catch (exception) {
        showError(`Error deleting blog: ${blog.title}`)
      }
    }
  }

  return (
    <div>
      <h2>{user === null ? 'log in to application' : 'blogs'}</h2>

      {notification
        && <Notification type={notification.type} message={notification.message} />}

      {user === null
        ? <LoginForm onLogin={handleLogin} />
        : (
          <div>
            <p>
              {user.name} logged in&nbsp;
              <button style={{ display: 'relative' }} type="button" onClick={handleLogout}>logout</button>
            </p>

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
          </div>
        )}
    </div>
  )
}

export default App
