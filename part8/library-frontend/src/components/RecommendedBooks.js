import React, { useEffect } from 'react'
import { useLazyQuery } from '@apollo/client'
import { ALL_BOOKS } from '../queries'
import BookList from './BookList'

const RecommendedBooks = ({ show, user }) => {
  const [getBooks, results] = useLazyQuery(ALL_BOOKS)
  const books = results.data ? results.data.allBooks || [] : []

  useEffect(() => {
    if (user) {
      getBooks({ variables: { genre: user.favoriteGenre }})
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  if (!show) return null

  return (
    <div>
      <h2>recommendations</h2>
      {results.loading
       ? <p>loading books...</p>
       : (
          <>
            <p>
              books in your favorite genre <strong>{user ? user.favoriteGenre : 'N/A'}</strong>
            </p>

            <BookList books={books} />
          </>
       )}
    </div>
  )
}

export default RecommendedBooks
