import React from 'react'

const Notification = ({ type, message }) => {
  if (message === null) {
    return null
  }

  const styles = {
    color: type === 'error' ? 'red' : 'green',
    background: 'lightgrey',
    fontSize: '20px',
    borderStyle: 'solid',
    borderRadius: '5px',
    padding: '10px',
    marginBottom: '10px',
  }

  return (
    <div style={styles}>
      {message}
    </div>
  )
}

export default Notification
