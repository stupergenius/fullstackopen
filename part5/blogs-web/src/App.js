import React, { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'

const sortBlogs = blogs => blogs.sort((a, b) => (a.likes > b.likes ? -1 : 1))

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const blogFormRef = useRef()

  const isUserOwner = blog => blog.user && blog.user.username === user.username

  const fetchBlogs = async () => {
    const allBlogs = await blogService.getAll()
    setBlogs(sortBlogs(allBlogs))
  }

  useEffect(() => {
    fetchBlogs()
  }, [])

  useEffect(() => {
    const storedUser = window.localStorage.getItem('user')
    if (!storedUser) return

    const existingUser = JSON.parse(storedUser)
    setUser(existingUser)
    blogService.setToken(existingUser.token)
  }, [])

  const showSuccess = (message) => {
    setSuccessMessage(message)

    setTimeout(() => setSuccessMessage(null), 3000)
  }

  const showError = (message) => {
    setErrorMessage(message)

    setTimeout(() => setErrorMessage(null), 3000)
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
      const addedBlog = await blogService.create(newBlog)

      setBlogs(blogs.concat([addedBlog]))
      blogFormRef.current.toggleVisibility()
      showSuccess(`a new blog ${addedBlog.title} by ${newBlog.author} added`)
    } catch (exception) {
      showError(`Error creating blog: ${exception.message}`)
    }
  }

  const handleLikeBlog = async (blog) => {
    try {
      const likedBlog = await blogService.update(blog.id, {
        ...blog,
        likes: blog.likes + 1,
      })

      const allBlogs = blogs.map(b => (b.id === likedBlog.id ? likedBlog : b))
      setBlogs(sortBlogs(allBlogs))
    } catch (exception) {
      showError(`Error liking blog: ${exception.message}`)
    }
  }

  const handleDeleteBlog = async (blog) => {
    if (window.confirm(`Delete ${blog.title} by ${blog.author}?`)) {
      try {
        await blogService.delete(blog.id)

        const allBlogs = blogs.filter(p => p.id !== blog.id)
        setBlogs(sortBlogs(allBlogs))
        setSuccessMessage(`Deleted blog: ${blog.title}`)
      } catch (exception) {
        setErrorMessage(`Error deleting blog: ${blog.title}`)
      }
    }
  }

  return (
    <div>
      <h2>{user === null ? 'log in to application' : 'blogs'}</h2>

      <Notification type="success" message={successMessage} />
      <Notification type="error" message={errorMessage} />

      {user === null
        ? <LoginForm onLogin={handleLogin} />
        : (
          <div>
            <p>
              {user.name} logged in&nbsp;
              <button style={{ display: 'relative' }} type="button" onClick={handleLogout}>logout</button>
            </p>

            <Togglable buttonLabel="new note" ref={blogFormRef}>
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
