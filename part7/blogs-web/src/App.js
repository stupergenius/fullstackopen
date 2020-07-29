import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Switch, Route } from 'react-router-dom'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import UserList from './components/UserList'
import UserDetails from './components/UserDetails'
import BlogList from './components/BlogList'
import { initBlogsAction } from './reducers/blogReducer'
import { showErrorNotificationAction } from './reducers/notificationReducer'
import { restoreUserAction, loginUserAction, logoutUserAction } from './reducers/loginReducer'

const App = () => {
  const dispatch = useDispatch()
  const notification = useSelector(state => state.notification)
  const user = useSelector(state => state.user)

  useEffect(() => {
    dispatch(restoreUserAction())
    dispatch(initBlogsAction())
  }, [dispatch])

  const handleLogin = async (username, password) => {
    try {
      dispatch(loginUserAction(username, password))
    } catch (exception) {
      dispatch(showErrorNotificationAction('Wrong Credentials'))
    }
  }

  const handleLogout = () => {
    dispatch(logoutUserAction())
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
              <Route path="/users/:id">
                <UserDetails />
              </Route>
              <Route path="/users">
                <UserList />
              </Route>
              <Route path="/">
                <BlogList />
              </Route>
            </Switch>
          </div>
        )}
    </div>
  )
}

export default App
