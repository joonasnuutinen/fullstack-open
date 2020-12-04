import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { addVote } from '../reducers/anecdoteReducer'

const Anecdote = ({ anecdote, vote }) => {
  return (
    <div>
      <div>
        {anecdote.content}
      </div>
      <div>
        has {anecdote.votes}
        <button onClick={() => vote(anecdote)}>vote</button>
      </div>
    </div>
  )
}

const AnecdoteList = ({ notify }) => {
  const dispatch = useDispatch()
  const anecdotes = useSelector(({ anecdotes, filter }) =>
    anecdotes
      .filter(a => a.content.toUpperCase().includes(filter.toUpperCase()))
      .sort((a1, a2) => a2.votes - a1.votes)
  )

  const vote = (anecdote) => {
    //console.log('vote', id)
    dispatch(addVote(anecdote))
    notify(`you voted '${anecdote.content}'`)
  }

  return (
    <div>
      {anecdotes.map(anecdote =>
        <Anecdote key={anecdote.id} anecdote={anecdote} vote={vote} />
      )}
    </div>
  )
}

export default AnecdoteList
