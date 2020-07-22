const asObject = (anecdote) => {
  return {
    content: anecdote,
    votes: 0
  }
}

export const voteActionFor = id => ({
  type: 'VOTE',
  data: { id },
})

export const newAnecdoteActionWith = anecdote => ({
  type: 'NEW_ANECDOTE',
  data: { anecdote }
})

export const initAnecdotesAction = anecdotes => ({
  type: 'INIT_ANECDOTES',
  data: anecdotes,
})

const reducer = (state = [], action) => {
  switch (action.type) {
    case 'VOTE':
      const existing = state.find(a => a.id === action.data.id)
      const voted = { ...existing, votes: existing.votes + 1 }
      return state.map(a => a.id === voted.id ? voted : a)
    case 'NEW_ANECDOTE':
      return [ ...state, asObject(action.data.anecdote) ]
    case 'INIT_ANECDOTES':
      return action.data
    default:
      return state
  }
}

export default reducer
