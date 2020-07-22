import React from 'react'
import { useDispatch } from 'react-redux'
import { newAnecdoteAction } from '../reducers/anecdoteReducer'
import { showNotificationAction } from '../reducers/notificationReducer'

const AnecdoteForm = () => {
  const dispatch = useDispatch()

  const handleAddAnecdote = async (event) => {
    event.preventDefault()

    const anecdote = event.target.anecdote.value
    event.target.anecdote.value = ''

    dispatch(newAnecdoteAction(anecdote))
    dispatch(showNotificationAction(`New anecdote created '${anecdote}'`, 5))
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
