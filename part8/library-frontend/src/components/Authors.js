import React from 'react'
import { useQuery } from '@apollo/client'
import { ALL_AUTHORS } from '../queries'
import SetBirthyear from './SetBirthyear'

const Authors = ({ show, canEditAuthor, onError }) => {
  const results = useQuery(ALL_AUTHORS)
  const authors = results.data ? results.data.allAuthors || [] : []

  if (!show) {
    return null
  }

  return (
    <div>
      <h2>authors</h2>
      {results.loading
       ? <p>loading authors...</p>
       : (
          <>
            <table>
              <tbody>
                <tr>
                  <th></th>
                  <th>
                    born
                  </th>
                  <th>
                    books
                  </th>
                </tr>
                {authors.map(a =>
                  <tr key={a.name}>
                    <td>{a.name}</td>
                    <td>{a.born}</td>
                    <td>{a.bookCount}</td>
                  </tr>
                )}
              </tbody>
            </table>

            {canEditAuthor &&
              <SetBirthyear authors={authors} onError={onError} />}
          </>
       )}

    </div>
  )
}

export default Authors
