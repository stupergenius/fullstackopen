import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import './index.css'

const Anecdote = ({anecdote, votes}) => {
  return (
    <p>
      {anecdote} <br/>
      has {votes} {"vote" + (votes === 1 ? '' : 's')}
    </p>
  )
}

const App = ({anecdotes}) => {
  const [selected, setSelected] = useState(0)
  const [votes, setVotes] = useState(Object.fromEntries(anecdotes.map(a => [a, 0])))
  const randomAnecdote = {
    text: anecdotes[selected],
    votes: votes[anecdotes[selected]]
  }
  const mostVotedAnecdote = (() => {
    let mostVoted = {
      text: anecdotes[0],
      votes: votes[anecdotes[0]]
    }

    for (const voteInfo of Object.entries(votes)) {
      if (voteInfo[1] > mostVoted.votes) {
        mostVoted = {text: voteInfo[0], votes: voteInfo[1]}
      }
    }

    return mostVoted
  })()

  const handleVoteClick = () => {
    setVotes({
      ...votes,
      [randomAnecdote.text]: votes[randomAnecdote.text] + 1
    })
  }

  const handleNextClick = () => {
    const newIndex = Math.floor(
      Math.random() * anecdotes.length)
    
    setSelected(newIndex)
  }

  return (
    <div>
      <h1>Anecdote of the day</h1>
      <Anecdote anecdote={randomAnecdote.text} votes={randomAnecdote.votes} />
      <button onClick={handleVoteClick}>vote</button>
      <button onClick={handleNextClick}>next anecdote</button>

      <h1>Anecdote with most votes</h1>
      <Anecdote anecdote={mostVotedAnecdote.text} votes={mostVotedAnecdote.votes} />
    </div>
  )
}

const anecdotes = [
  'If it hurts, do it more often',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
]

ReactDOM.render(
  <App anecdotes={anecdotes} />,
  document.getElementById('root')
)
