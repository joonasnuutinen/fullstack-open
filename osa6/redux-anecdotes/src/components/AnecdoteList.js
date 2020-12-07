import React from 'react'
import { connect } from 'react-redux'
import { addVote } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'

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

const AnecdoteList = (props) => {
  const anecdotesToShow = props.anecdotes
    .filter(a => a.content.toUpperCase().includes(props.filter.toUpperCase()))
    .sort((a1, a2) => a2.votes - a1.votes)

  const vote = (anecdote) => {
    //console.log('vote', id)
    props.addVote(anecdote)
    props.setNotification(`you voted '${anecdote.content}'`, 5)
  }

  return (
    <div>
      {anecdotesToShow.map(anecdote =>
        <Anecdote key={anecdote.id} anecdote={anecdote} vote={vote} />
      )}
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    anecdotes: state.anecdotes,
    filter: state.filter
  }
}

const mapDispatchToProps = {
  addVote, setNotification
}

const ConnectedAnecdoteList = connect(
  mapStateToProps, mapDispatchToProps
)(AnecdoteList)
export default ConnectedAnecdoteList
