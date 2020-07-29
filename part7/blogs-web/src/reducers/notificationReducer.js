let notificationTimeoutId = null

export const hideNotificationAction = () => ({
  type: 'HIDE_NOTIFICATION',
})

export const showNotificationAction = (type, message, delaySeconds) => (dispatch) => {
  dispatch({
    type: 'SHOW_NOTIFICATION',
    data: { type, message },
  })

  if (notificationTimeoutId !== null) {
    clearTimeout(notificationTimeoutId)
  }

  notificationTimeoutId = setTimeout(() => {
    notificationTimeoutId = null
    dispatch(hideNotificationAction())
  }, delaySeconds * 1000);
}

export const showSuccessNotificationAction = message => showNotificationAction('success', message, 3)
export const showErrorNotificationAction = message => showNotificationAction('error', message, 3)

const reducer = (state = null, action) => {
  switch (action.type) {
  case 'SHOW_NOTIFICATION':
    return action.data
  case 'HIDE_NOTIFICATION':
    return null
  default:
    return state
  }
}

export default reducer
