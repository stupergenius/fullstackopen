import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { loginUserAction } from '../../reducers/loginReducer'
import { showErrorNotificationAction } from '../../reducers/notificationReducer'

const LoginForm = () => {
  const dispatch = useDispatch()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = (event) => {
    event.preventDefault()

    try {
      dispatch(loginUserAction(username, password))
      setUsername('')
      setPassword('')
    } catch (exception) {
      dispatch(showErrorNotificationAction('Wrong Credentials'))
    }
  }

  return (
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
}

export default LoginForm
