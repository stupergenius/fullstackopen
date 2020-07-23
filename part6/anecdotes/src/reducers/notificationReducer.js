let notificationTimeoutId = null

export const showNotificationAction = (message, delaySeconds) => {
  return (dispatch) => {
    dispatch({
      type: 'SHOW_NOTIFICATION',
      message
    })

    if (notificationTimeoutId !== null) {
      clearTimeout(notificationTimeoutId)
    }

    notificationTimeoutId = setTimeout(() => {
      notificationTimeoutId = null
      dispatch(hideNotificationAction())
    }, delaySeconds * 1000);
  }
}

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
