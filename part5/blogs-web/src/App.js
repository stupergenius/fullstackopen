import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [newBlog, setNewBlog] = useState({ title: '', author: '', url: '' })
  const [successMessage, setSuccessMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  const fetchBlogs = async () => {
    const allBlogs = await blogService.getAll()
    setBlogs(allBlogs)
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

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const newUser = await loginService.login(username, password)

      setUser(newUser)
      window.localStorage.setItem('user', JSON.stringify(newUser))
      blogService.setToken(newUser.token)

      setUsername('')
      setPassword('')
    } catch (exception) {
      showError('Wrong Credentials')
    }
  }

  const handleLogout = () => {
    setUser(null)
    window.localStorage.removeItem('user')
  }

  const handleSubmitBlog = async (event) => {
    event.preventDefault()

    try {
      const addedBlog = await blogService.create(newBlog)

      setNewBlog({ title: '', author: '', url: '' })
      setBlogs(blogs.concat([addedBlog]))
    } catch (exception) {
      showError(`Error creating blog: ${exception.message}`)
    }
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>
  )

  const blogForm = () => (
    <form onSubmit={handleSubmitBlog}>
      <div>
        title:
        <input
          type="text"
          value={newBlog.title}
          name="blog_title"
          onChange={({ target }) => setNewBlog({ ...newBlog, title: target.value })}
        />
      </div>
      <div>
        author:
        <input
          type="text"
          value={newBlog.author}
          name="blog_author"
          onChange={({ target }) => setNewBlog({ ...newBlog, author: target.value })}
        />
      </div>
      <div>
        url:
        <input
          type="text"
          value={newBlog.url}
          name="blog_url"
          onChange={({ target }) => setNewBlog({ ...newBlog, url: target.value })}
        />
      </div>
      <button type="submit">create</button>
    </form>
  )

  return (
    <div>
      <h2>{user === null ? 'log in to application' : 'blogs'}</h2>

      {user !== null && (
        <p>
          {user.name} logged in&nbsp;
          <button style={{ display: 'relative' }} type="button" onClick={handleLogout}>logout</button>
        </p>
      )}

      <Notification type="success" message={successMessage} />
      <Notification type="error" message={errorMessage} />

      {user === null
        ? loginForm()
        : (
          <div>
            {blogForm()}
            {blogs.map(blog => <Blog key={blog.id} blog={blog} />)}
          </div>
        )}
    </div>
  )
}

export default App
