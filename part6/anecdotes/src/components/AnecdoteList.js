import React from 'react'
import { connect } from 'react-redux'
import { voteAction } from '../reducers/anecdoteReducer'
import { showNotificationAction } from '../reducers/notificationReducer'
import Notification from './Notification'
import Filter from './Filter'

const AnecdoteList = (props) => {
  const vote = (anecdote) => {
    props.voteAction(anecdote)
    props.showNotificationAction(`you voted '${anecdote.content}'`, 5)
  }

  return (
    <>
      <h2>Anecdotes</h2>
      <Notification />
      <Filter />

      {props.anecdotes.map(anecdote =>
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
  const filter = state.filter.trim().toLowerCase()

  const filteredAnecdotes = filter.length === 0
    ? state.anecdotes
    : state.anecdotes.filter(a => a.content.toLowerCase().includes(filter))
  const anecdotes = filteredAnecdotes.sort((a, b) => (a.votes > b.votes ? -1 : 1))

  return { anecdotes }
}

const mapDispatchToProps = {
  voteAction,
  showNotificationAction,
}

const ConnectedAnecdoteList = connect(mapStateToProps, mapDispatchToProps)(AnecdoteList)

export default ConnectedAnecdoteList
