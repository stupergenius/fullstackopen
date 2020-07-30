import React from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'

const UserList = () => {
  const userId = useParams().id
  const user = useSelector(state => state.users.find(u => u.id === userId))

  if (!user) return null

  return (
    <>
      <h2>{user.name}</h2>
      <p><b>added blogs</b></p>
      {user.blogs.length === 0
        ? <p>None!</p>
        : (
          <ul>
            {user.blogs.map(blog => (
              <li key={blog.id}>{blog.title}</li>
            ))}
          </ul>
        )}
    </>
  )
}

export default UserList
