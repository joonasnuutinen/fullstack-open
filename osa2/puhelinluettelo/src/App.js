import React, { useEffect, useState } from 'react'
import personService from './services/persons'

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

const PersonsList = ({ persons, filter, removePerson }) => (
  <div>
    {persons
      .filter(person => person.name.toUpperCase().includes(filter.toUpperCase()))
      .map(person => <Person key={person.name} person={person} removePerson={removePerson} />)}
  </div>
)

const Person = ({ person, removePerson }) => (
  <div>
    {person.name} {person.number} <button onClick={() => removePerson(person.id)}>delete</button>
  </div>
)

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])
  
  const addPerson = (event) => {
    event.preventDefault()
    if (persons.map(person => person.name).indexOf(newName) !== -1) {
      return alert(`${newName} is already added to phonebook`)
    }
    const newPerson = {
      name: newName,
      number: newNumber
    }

    personService
      .create(newPerson)
      .then(createdPerson => {
        setPersons(persons.concat(createdPerson))
        setNewName('')
        setNewNumber('')
      })
  }

  const removePerson = (id) => {
    if (!window.confirm(`Delete ${persons.find(person => person.id === id).name}?`)) {
      return
    }
    personService
      .remove(id)
      .then(() => {
        setPersons(persons.filter(person => person.id !== id))
      })
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
      <PersonsList persons={persons} filter={newFilter} removePerson={removePerson} />
    </div>
  );
}

export default App
