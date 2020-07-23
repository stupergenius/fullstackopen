import React from 'react'
import { connect } from 'react-redux'
import { newAnecdoteAction } from '../reducers/anecdoteReducer'
import { showNotificationAction } from '../reducers/notificationReducer'

const AnecdoteForm = (props) => {
  const handleAddAnecdote = async (event) => {
    event.preventDefault()

    const anecdote = event.target.anecdote.value
    event.target.anecdote.value = ''

    props.newAnecdoteAction(anecdote)
    props.showNotificationAction(`New anecdote created '${anecdote}'`, 5)
  }

  return (
    <>
      <h2>create new</h2>
      <form onSubmit={handleAddAnecdote}>
        <div><input name="anecdote" /></div>
        <button type="submit">create</button>
      </form>
    </>
  )
}

const mapDispatchToProps = {
  newAnecdoteAction,
  showNotificationAction,
}

const ConnectedAnecdoteForm = connect(null, mapDispatchToProps)(AnecdoteForm)

export default ConnectedAnecdoteForm
