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

  const navStyle = {
    backgroundColor: 'lightgrey',
    padding: '0.25em',
  }

  return (
    <div style={navStyle}>
      <span>
        <Link to="/">blogs</Link>&nbsp;
        <Link to="/users">users</Link>&nbsp;
      </span>
      <span>
        {user.name} logged in&nbsp;
        <button style={{ display: 'relative' }} type="button" onClick={handleLogout}>logout</button>
      </span>
    </div>
  )
}

export default Navigation
