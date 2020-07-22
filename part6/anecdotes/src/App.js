import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import AnecdoteForm from './components/AnecdoteForm'
import AnecdoteList from './components/AnecdoteList'
import anecdoteService from './services/anecdotes'
import { initAnecdotesAction } from './reducers/anecdoteReducer'

const App = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    anecdoteService.getAll().then(anecdotes => dispatch(initAnecdotesAction(anecdotes)))
  }, [dispatch])

  return (
    <div>
      <AnecdoteList />
      <AnecdoteForm />
    </div>
  )
}

export default App