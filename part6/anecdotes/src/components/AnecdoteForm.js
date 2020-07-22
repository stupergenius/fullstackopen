import React from 'react'
import { useDispatch } from 'react-redux'
import { newAnecdoteActionWith } from '../reducers/anecdoteReducer'
import { showNotificationAction, hideNotificationAction } from '../reducers/notificationReducer'

const AnecdoteForm = () => {
  const dispatch = useDispatch()

  const handleAddAnecdote = (event) => {
    event.preventDefault()

    const anecdote = event.target.anecdote.value
    event.target.anecdote.value = ''

    dispatch(newAnecdoteActionWith(anecdote))
    dispatch(showNotificationAction(`New anecdote created '${anecdote}'`))
    setTimeout(() => dispatch(hideNotificationAction()), 5000)
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

export default AnecdoteForm
