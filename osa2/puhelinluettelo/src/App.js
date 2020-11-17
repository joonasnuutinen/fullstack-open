import React, { useState } from 'react'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Testi Testinen', number: '123456789' },
    { name: 'Toukkis Matonen', number: '450982' },
    { name: 'Sulevi Väinölälä', number: '997006' },
    { name: 'Plääh', number: '444444' },
  ])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')
  
  const addPerson = (event) => {
    event.preventDefault()
    if (persons.map(person => person.name).indexOf(newName) !== -1) {
      return alert(`${newName} is already added to phonebook`)
    }
    const newPerson = {
      name: newName,
      number: newNumber
    }
    setPersons(persons.concat(newPerson))
    setNewName('')
    setNewNumber('')
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setNewFilter(event.target.value)
  }
  
  return (
    <div>
      <h2>Phonebook</h2>
      <div>
        filter
        <input value={newFilter} onChange={handleFilterChange} />
      </div>
      <h2>Add new</h2>
      <form onSubmit={addPerson}>
        <div>
          name:
          <input value={newName} onChange={handleNameChange} />
        </div>
        <div>
          number:
          <input value={newNumber} onChange={handleNumberChange} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      {persons.filter(person => person.name.toUpperCase().includes(newFilter.toUpperCase())).map(person => <p key={person.name}>{person.name} {person.number}</p>)}
    </div>
  );
}

export default App
