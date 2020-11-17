import React, { useState } from 'react'

const Input = ({ label, value, onChange }) => (
  <div>
    {label}:
    <input value={value} onChange={onChange} />
  </div>
)

const PersonForm = (props) => {
  const {
    onSubmit,
    newName,
    handleNameChange,
    newNumber,
    handleNumberChange
  } = props
  
  return (
    <form onSubmit={onSubmit}>
      <Input label="name" value={newName} onChange={handleNameChange} />
      <Input label="number" value={newNumber} onChange={handleNumberChange} />
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

const PersonsList = ({ persons, filter }) => (
  <div>
    {persons.filter(person => person.name.toUpperCase().includes(filter.toUpperCase())).map(person => <Person key={person.name} person={person} />)}
  </div>
)

const Person = ({ person }) => <p>{person.name} {person.number}</p>

const App = () => {
  const [persons, setPersons] = useState([])
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
      <h1>Phonebook</h1>
      <Input label="filter" value={newFilter} onChange={handleFilterChange} />
      <h2>Add new</h2>
      <PersonForm
        onSubmit={addPerson}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />
      
      <h2>Numbers</h2>
      <PersonsList persons={persons} filter={newFilter} />
    </div>
  );
}

export default App
