import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { initUsersAction } from '../reducers/userReducer'

const UserList = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(initUsersAction())
  }, [dispatch])

  const users = useSelector(state => state.users)

  return (
    <>
      <h2>Users</h2>
      <table>
        <thead>
          <tr><th>&nbsp;</th><th>blogs created</th></tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td><Link to={`/users/${user.id}`}>{user.name}</Link></td>
              <td>{user.blogs.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}

export default UserList
