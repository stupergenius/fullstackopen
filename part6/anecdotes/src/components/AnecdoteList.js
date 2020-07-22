import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { voteActionFor } from '../reducers/anecdoteReducer'
import { showNotificationAction, hideNotificationAction } from '../reducers/notificationReducer'
import Notification from './Notification'

const sortAnecdotes = anecdotes => anecdotes.sort((a, b) => (a.votes > b.votes ? -1 : 1))

const AnecdoteList = () => {
  const anecdotes = useSelector(({ anecdotes }) => sortAnecdotes(anecdotes))
  const dispatch = useDispatch()

  const vote = ({ id, content }) => {
    dispatch(voteActionFor(id))
    dispatch(showNotificationAction(`you voted '${content}'`))
    setTimeout(() => dispatch(hideNotificationAction()), 5000)
  }

  return (
    <>
      <h2>Anecdotes</h2>
      <Notification />

      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </>
  )
}

export default AnecdoteList
