import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { voteAction } from '../reducers/anecdoteReducer'
import { showNotificationAction, hideNotificationAction } from '../reducers/notificationReducer'
import Notification from './Notification'
import Filter from './Filter'

const AnecdoteList = () => {
  const filter = useSelector(({ filter }) => filter.trim().toLowerCase())
  const filterAnecdotes = (allAnecdotes) => {
    return filter.length === 0
      ? allAnecdotes
      : allAnecdotes.filter(a => a.content.toLowerCase().includes(filter))
  }
  const sortAnecdotes = anecdotes => anecdotes.sort((a, b) => (a.votes > b.votes ? -1 : 1))

  const anecdotes = useSelector(({ anecdotes }) => sortAnecdotes(filterAnecdotes(anecdotes)))
  const dispatch = useDispatch()

  const vote = ({ id, content }) => {
    dispatch(voteAction(id))
    dispatch(showNotificationAction(`you voted '${content}'`))
    setTimeout(() => dispatch(hideNotificationAction()), 5000)
  }

  return (
    <>
      <h2>Anecdotes</h2>
      <Notification />
      <Filter />

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
