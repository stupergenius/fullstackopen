import anecdoteService from '../services/anecdotes'

export const voteAction = anecdote => {
  return async (dispatch) => {
    const votedAnecdote = await anecdoteService.update({ ...anecdote, votes: anecdote.votes + 1 })
    dispatch({
      type: 'VOTE',
      data: votedAnecdote,
    })
  }
}

export const newAnecdoteAction = (content) => {
  return async (dispatch) => {
    const anecdote = await anecdoteService.create(content)
    dispatch({
      type: 'NEW_ANECDOTE',
      data: anecdote,
    })
  }
}

export const initAnecdotesAction = () => {
  return async (dispatch) => {
    const anecdotes = await anecdoteService.getAll()
    dispatch({
      type: 'INIT_ANECDOTES',
      data: anecdotes,
    })
  }
}

const reducer = (state = [], action) => {
  switch (action.type) {
    case 'VOTE':
      const voted = action.data
      return state.map(a => a.id === voted.id ? voted : a)
    case 'NEW_ANECDOTE':
      return [ ...state, action.data ]
    case 'INIT_ANECDOTES':
      return action.data
    default:
      return state
  }
}

export default reducer
