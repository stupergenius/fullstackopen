export const showNotificationAction = message => ({
  type: 'SHOW_NOTIFICATION',
  message
})

export const hideNotificationAction = () => ({
  type: 'HIDE_NOTIFICATION',
})

const reducer = (state = null, action) => {
  switch (action.type) {
    case 'SHOW_NOTIFICATION':
      return action.message
    case 'HIDE_NOTIFICATION':
        return null
    default:
      return state
  }
}

export default reducer
