import React, { useEffect } from 'react'
import AnecdoteForm from './components/AnecdoteForm'
import AnecdoteList from './components/AnecdoteList'
import Notification from './components/Notification'
import Filter from './components/Filter'
import { useDispatch } from 'react-redux'
import { initializeAnecdotes } from './reducers/anecdoteReducer'
import { showNotification, removeNotification } from './reducers/notificationReducer'

const App = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(initializeAnecdotes())
  }, [dispatch])

  const notify = (content) => {
    dispatch(showNotification(content))
    setTimeout(() => {
      dispatch(removeNotification())
    }, 5000)
  }

  return (
    <div>
      <h2>Anecdotes</h2>
      <Notification />
      <Filter />
      <AnecdoteList notify={notify} />
      <h2>create new</h2>
      <AnecdoteForm notify={notify} />
    </div>
  )
}

export default App
