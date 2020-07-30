import React from 'react'
import { useSelector } from 'react-redux'

const Notification = () => {
  const notification = useSelector(state => state.notification)

  if (notification === null || notification.message === null) {
    return null
  }

  const alertClass = notification.type === 'error' ? 'alert-danger' : 'alert-success'

  return (
    <div className={`alert my-2 ${alertClass}`} role="alert">
      {notification.message}
    </div>
  )
}

export default Notification
