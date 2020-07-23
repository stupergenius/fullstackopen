import React from 'react'
import { connect, useDispatch } from 'react-redux'
import { voteAction } from '../reducers/anecdoteReducer'
import { showNotificationAction } from '../reducers/notificationReducer'
import Notification from './Notification'
import Filter from './Filter'

const AnecdoteList = (props) => {
  const filter = props.filter.trim().toLowerCase()
  const filterAnecdotes = (allAnecdotes) => {
    return filter.length === 0
      ? allAnecdotes
      : allAnecdotes.filter(a => a.content.toLowerCase().includes(filter))
  }
  const sortAnecdotes = toSort => toSort.sort((a, b) => (a.votes > b.votes ? -1 : 1))

  const anecdotes = sortAnecdotes(filterAnecdotes(props.anecdotes))
  const dispatch = useDispatch()

  const vote = (anecdote) => {
    dispatch(voteAction(anecdote))
    dispatch(showNotificationAction(`you voted '${anecdote.content}'`, 5))
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

const mapStateToProps = (state) => {
  return {
    anecdotes: state.anecdotes,
    filter: state.filter
  }
}

const ConnectedAnecdoteList = connect(mapStateToProps)(AnecdoteList)

export default ConnectedAnecdoteList
