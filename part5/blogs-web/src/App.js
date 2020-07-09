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
  const [successMessage, setSuccessMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(async () => {
    const allBlogs = await blogService.getAll()
    setBlogs(allBlogs)
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
      setUsername('')
      setPassword('')
    } catch (exception) {
      showError('Wrong Credentials')
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

  return (
    <div>
      <h2>{user === null ? 'log in to application' : 'blogs'}</h2>

      <Notification type="success" message={successMessage} />
      <Notification type="error" message={errorMessage} />

      {user === null
        ? loginForm()
        : blogs.map(blog => <Blog key={blog.id} blog={blog} />)
      }
    </div>
  )
}

export default App
