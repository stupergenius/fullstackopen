import React, { useState, useEffect } from 'react'
import { useLazyQuery, useSubscription, useApolloClient } from '@apollo/client'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import Notify from './components/Notify'
import UserAccount from './components/UserAccount'
import RecommendedBooks from './components/RecommendedBooks'
import { CURRENT_USER, BOOK_ADDED, ALL_BOOKS } from './queries'

const App = () => {
  const [page, setPage] = useState('authors')
  const [token, setToken] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const client = useApolloClient()
  const [getUser, userResponse] = useLazyQuery(CURRENT_USER)
  const user = (token && userResponse.data) ? userResponse.data.me : null

  const updateCacheWith = (addedBook) => {
    const includedIn = (set, object) =>
      set.map(p => p.id).includes(object.id)

    const dataInStore = client.readQuery({ query: ALL_BOOKS })
    if (!includedIn(dataInStore.allBooks, addedBook)) {
      client.writeQuery({
        query: ALL_BOOKS,
        data: { allBooks : dataInStore.allBooks.concat(addedBook) }
      })
    }
  }

  useSubscription(BOOK_ADDED, {
    onSubscriptionData: ({ subscriptionData }) => {
      const book = subscriptionData.data.bookAdded
      updateCacheWith(book)
    }
  })

  useEffect(() => {
    const storedToken = localStorage.getItem('library-user-token')
    if (storedToken) {
      setToken(storedToken)
    }
  }, [])

  useEffect(() => {
    if (token) {
      getUser()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  const handleError = (message) => {
    setErrorMessage(message)
    setTimeout(() => setErrorMessage(null), 5000)
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        {token && <button onClick={() => setPage('add')}>add book</button>}
        {token && <button onClick={() => setPage('recommended')}>recommended</button>}
        <button onClick={() => setPage('user_account')}>user acount</button>
      </div>

      <Notify errorMessage={errorMessage} />

      <Authors
        show={page === 'authors'}
        canEditAuthor={token !== null}
        onError={handleError}
      />

      <Books
        show={page === 'books'}
      />

      <NewBook
        show={page === 'add'}
        updateCacheWith={updateCacheWith}
        onError={handleError}
      />

      <RecommendedBooks
        show={page === 'recommended'}
        user={user}
      />

      <UserAccount
        show={page === 'user_account'}
        user={user}
        setError={handleError}
        setToken={setToken}
      />

    </div>
  )
}

export default App