import React from 'react'
import { useDispatch } from 'react-redux'
import { createAnecdote } from '../reducers/anecdoteReducer'
import anecdoteService from '../services/anecdotes'

const AnecdoteForm = ({ notify }) => {
  const dispatch = useDispatch()

  const addAnecdote = async (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    const newAnecdote = await anecdoteService.createNew(content)
    dispatch(createAnecdote(newAnecdote))
    notify(`you added '${content}'`)
  }

  return (
    <form onSubmit={addAnecdote}>
      <div><input name="anecdote" /></div>
      <button type="submit">create</button>
    </form>
  )
}

export default AnecdoteForm
