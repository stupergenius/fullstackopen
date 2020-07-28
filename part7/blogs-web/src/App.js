import React, { useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  Switch, Route, Link,
  useParams, useHistory,
} from 'react-router-dom'
import Blog from './components/Blog'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import {
  initBlogsAction,
  newBlogAction,
  likeAction,
  deleteBlogAction,
} from './reducers/blogReducer'
import { showNotificationAction } from './reducers/notificationReducer'
import { restoreUserAction, loginUserAction, logoutUserAction } from './reducers/loginReducer'
import UserList from './components/UserList'

const App = () => {
  const dispatch = useDispatch()
  const blogs = useSelector(state => state.blogs.sort((a, b) => (a.likes > b.likes ? -1 : 1)))
  const notification = useSelector(state => state.notification)
  const user = useSelector(state => state.user)
  const blogFormRef = useRef()

  const isUserOwner = blog => blog.user && blog.user.username === user.username

  useEffect(() => {
    dispatch(restoreUserAction())
    dispatch(initBlogsAction())
  }, [dispatch])

  const showSuccess = (message) => {
    dispatch(showNotificationAction('success', message, 3))
  }

  const showError = (message) => {
    dispatch(showNotificationAction('error', message, 3))
  }

  const handleLogin = async (username, password) => {
    try {
      dispatch(loginUserAction(username, password))
    } catch (exception) {
      showError('Wrong Credentials')
    }
  }

  const handleLogout = () => {
    dispatch(logoutUserAction())
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

            <Switch>
              <Route path="/users">
                <UserList />
              </Route>
              <Route path="/">
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
              </Route>
            </Switch>
          </div>
        )}
    </div>
  )
}

export default App
