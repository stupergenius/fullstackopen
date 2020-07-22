import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import AnecdoteForm from './components/AnecdoteForm'
import AnecdoteList from './components/AnecdoteList'
import { initAnecdotesAction } from './reducers/anecdoteReducer'

const App = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(initAnecdotesAction())
  }, [dispatch])

  return (
    <div>
      <AnecdoteList />
      <AnecdoteForm />
    </div>
  )
}

export default App