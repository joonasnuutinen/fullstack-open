import React from 'react'
import AnecdoteForm from './components/AnecdoteForm'
import AnecdoteList from './components/AnecdoteList'
import Notification from './components/Notification'
import { useDispatch } from 'react-redux'
import { showNotification, removeNotification } from './reducers/notificationReducer'

const App = () => {
  const dispatch = useDispatch()
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
      <AnecdoteForm notify={notify} />
      <AnecdoteList notify={notify} />
    </div>
  )
}

export default App
