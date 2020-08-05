import React, { useState } from 'react'
import { useQuery } from '@apollo/client'
import { ALL_BOOKS } from '../queries'
import BookFilter from './BookFilter'
import BookList from './BookList'

const Books = (props) => {
  const [filter, setFilter] = useState(null)
  const results = useQuery(ALL_BOOKS)
  const books = results.data ? results.data.allBooks || [] : []
  const filteredBooks = filter ? books.filter(b => b.genres.includes(filter)) : books
  const allGenres = [...new Set(books.flatMap(b => b.genres))]

  if (!props.show) {
    return null
  }

  return (
    <div>
      <h2>books</h2>
      {results.loading
       ? <p>loading books...</p>
       : (
          <>
            {filter &&
              <p>
                in genre <strong>{filter}</strong>
              </p>
            }

            <BookList books={filteredBooks} />
            <BookFilter genres={allGenres} filter={filter} setFilter={setFilter} />
          </>
       )}
    </div>
  )
}

export default Books