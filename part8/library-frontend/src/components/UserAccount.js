import React from 'react'
import { useApolloClient } from '@apollo/client'
import LoginForm from './LoginForm'

const UserAccount = ({ show, isLoggedIn, setError, setToken }) => {
  const client = useApolloClient()

  const handleLogout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }

  if (!show) {
    return null
  }

  return (
    <div>
      <h2>user account</h2>
      {isLoggedIn
        ? (
            <div>
              <p>logged in</p>
              <button type="button" onClick={handleLogout}>logout</button>
            </div>
        )
        : <LoginForm setError={setError} setToken={setToken} />
      }
    </div>
  )
}

export default UserAccount