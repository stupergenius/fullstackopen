export const setNotificationAction = message => ({
  type: 'SHOW_NOTIFICATION',
  message
})

const reducer = (state = 'Hello World', action) => {
  switch (action.type) {
    case 'SHOW_NOTIFICATION':
      return action.message
    default:
      return state
  }
}

export default reducer
