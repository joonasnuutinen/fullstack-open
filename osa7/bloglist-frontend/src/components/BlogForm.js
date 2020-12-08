import React, { useState, useRef } from 'react'
import { useDispatch } from 'react-redux'
import Togglable from './Togglable'
import { TextInput } from './Input'
import { addBlog } from '../reducers/blogReducer'
import { notify } from '../reducers/notificationReducer'

const BlogForm = () => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const dispatch = useDispatch()

  const handleSubmit = async event => {
    event.preventDefault()

    const newBlog = { title, author, url }

    try {
      const storedBlog = await dispatch(addBlog(newBlog))
      setTitle('')
      setAuthor('')
      setUrl('')
      togglableRef.current.toggleVisibility()
      dispatch(notify(`a new blog ${storedBlog.title} by ${storedBlog.author} added`, 'success'))
    } catch (exception) {
      dispatch(notify('Adding new blog failed', 'error'))
    }
  }

  const togglableRef = useRef()

  return (
    <Togglable buttonLabel="new blog" ref={togglableRef}>
      <form onSubmit={handleSubmit}>
        <TextInput label="title" value={title} name="title" setValue={setTitle} />
        <TextInput label="author" value={author} name="author" setValue={setAuthor} />
        <TextInput label="url" value={url} name="url" setValue={setUrl} />
        <button type="submit">create</button>
      </form>
    </Togglable>
  )
}

export default BlogForm
