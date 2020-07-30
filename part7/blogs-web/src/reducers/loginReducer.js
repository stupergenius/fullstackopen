import blogService from '../services/blogs'
import loginService from '../services/login'
import { showErrorNotificationAction } from './notificationReducer'

export const setUserAction = user => ({
  type: 'SET_USER',
  data: { user },
})

export const restoreUserAction = () => (dispatch) => {
  const storedUser = window.localStorage.getItem('user')
  if (!storedUser) return

  const existingUser = JSON.parse(storedUser)
  dispatch(setUserAction(existingUser))
}

export const loginUserAction = (username, password) => async (dispatch) => {
  try {
    const newUser = await loginService.login(username, password)
    dispatch(setUserAction(newUser))
  } catch (error) {
    dispatch(showErrorNotificationAction('Wrong Credentials'))
  }
}

export const logoutUserAction = () => ({
  type: 'LOGOUT',
})

const reducer = (state = null, action) => {
  switch (action.type) {
  case 'SET_USER':
    window.localStorage.setItem('user', JSON.stringify(action.data.user))
    blogService.setToken(action.data.user.token)

    return action.data.user
  case 'LOGOUT':
    blogService.setToken(null)
    window.localStorage.removeItem('user')

    return null
  default:
    return state
  }
}

export default reducer
