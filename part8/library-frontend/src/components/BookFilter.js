import React from 'react'
import Select from 'react-select'

const BookFilter = ({ genres, filter, setFilter }) => {
  const filterOptions = genres.map(g => ({ label: g, value: g }))

  const handleFilterChange = (option) => {
    setFilter(option ? option.value : null)
  }

  return (
    <div>
      <p>Filter by genre: </p>
      <Select
        onChange={handleFilterChange}
        options={filterOptions}
        value={{ label: filter, value: filter }}
        isClearable={true}
      />
    </div>
  )
}

export default BookFilter
