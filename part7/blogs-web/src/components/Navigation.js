import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { logoutUserAction } from '../reducers/loginReducer'

const Navigation = () => {
  const dispatch = useDispatch()
  const user = useSelector(state => state.user)

  const handleLogout = () => {
    dispatch(logoutUserAction())
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light mb-2">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">Blogs</Link>
        <span className="nav-item mr-auto">
          <Link className="nav-link active" to="/users">Users</Link>
        </span>
        <span className="navbar-text">
          {user.name} logged in &nbsp;
        </span>
        <button className="btn" type="button" onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  )
}

export default Navigation
