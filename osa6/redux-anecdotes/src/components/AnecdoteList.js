import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { addVote } from '../reducers/anecdoteReducer'

const AnecdoteList = ({ notify }) => {
  const dispatch = useDispatch()
  const anecdotes = useSelector(state => state.anecdotes.sort((a1, a2) => a2.votes - a1.votes))

  const vote = ({ id, content }) => {
    console.log('vote', id)
    dispatch(addVote(id))
    notify(`you voted '${content}'`)
  }

  return (
    <div>
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AnecdoteList
