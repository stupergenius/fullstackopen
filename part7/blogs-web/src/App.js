import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Switch, Route } from 'react-router-dom'
import Notification from './components/common/Notification'
import LoginForm from './components/users/LoginForm'
import UserList from './components/users/UserList'
import UserDetails from './components/users/UserDetails'
import BlogList from './components/blogs/BlogList'
import BlogDetails from './components/blogs/BlogDetails'
import Navigation from './components/Navigation'
import { initBlogsAction } from './reducers/blogReducer'
import { restoreUserAction } from './reducers/loginReducer'

const App = () => {
  const dispatch = useDispatch()
  const user = useSelector(state => state.user)

  useEffect(() => {
    dispatch(restoreUserAction())
    dispatch(initBlogsAction())
  }, [dispatch])

  return (
    <div>
      {user === null
        ? (
          <div>
            <Notification />
            <LoginForm />
          </div>
        )
        : (
          <div>
            <Navigation />
            <Notification />

            <Switch>
              <Route path="/users/:id">
                <UserDetails />
              </Route>
              <Route path="/users">
                <UserList />
              </Route>
              <Route path="/blogs/:id">
                <BlogDetails />
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
