import React from 'react'
import { useQuery } from '@apollo/client'
import { ALL_BOOKS } from '../queries'
import BookList from './BookList'

const RecommendedBooks = ({ show, user }) => {
  const results = useQuery(ALL_BOOKS)
  const books = results.data ? results.data.allBooks || [] : []
  const recommendedBooks = user ? books.filter(b => b.genres.includes(user.favoriteGenre)) : []

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

            <BookList books={recommendedBooks} />
          </>
       )}
    </div>
  )
}

export default RecommendedBooks
