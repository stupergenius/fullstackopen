import React, { useState } from 'react'
import './App.css'

const Person = ({person}) => {
  return (
    <>
      <span>{person.name} {person.phone}</span>
      <br />
    </>
  )
}

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456' },
    { name: 'Ada Lovelace', number: '39-44-5323523' },
    { name: 'Dan Abramov', number: '12-43-234345' },
    { name: 'Mary Poppendieck', number: '39-23-6423122' }
  ])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  const personsToShow = searchQuery.length > 0
    ? persons.filter(p => p.name.toLocaleLowerCase().includes(searchQuery))
    : persons

  const handleNameChange = ({ target }) => setNewName(target.value)

  const handleNumberChange = ({ target }) => setNewNumber(target.value)

  const handleSearchQueryChange = ({ target }) => {
    const query = target.value
    if (query == null) {
      setSearchQuery('')
    } else {
      setSearchQuery(query.trim().toLocaleLowerCase())
    }
  }

  const handleFormSubmit = (event) => {
    event.preventDefault()

    const existingNames = persons.map(p => p.name)
    if (existingNames.includes(newName)) {
      alert(`${newName} is already added to phonebook`)
      return
    }

    const newPerson = { name: newName, phone: newNumber }

    setPersons(persons.concat(newPerson))
    setNewName('')
    setNewNumber('')
  }

  return (
    <div>
      <h2>Phonebook</h2>

      <div>
        filter shown with:
        <input onChange={handleSearchQueryChange} />
      </div>

      <form>
        <div>
          name: <input value={newName} onChange={handleNameChange} />
        </div>
        <div>
          number: <input value={newNumber} onChange={handleNumberChange} />
        </div>
        <div>
          <button type="submit" onClick={handleFormSubmit}>add</button>
        </div>
      </form>

      <h2>Numbers</h2>
      {personsToShow.map(p =>
        <Person key={p.name} person={p} />
      )}
    </div>
  )
}

export default App
