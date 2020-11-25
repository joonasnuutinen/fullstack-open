import React, { useState, useRef } from 'react'
import Togglable from './Togglable'
import { TextInput } from './Input'
import blogService from '../services/blogs'

const BlogForm = ({ onSuccess, onError }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleSubmit = async event => {
    event.preventDefault()
    const newBlog = { title, author, url }

    try {
      const storedBlog = await blogService.create(newBlog)
      setTitle('')
      setAuthor('')
      setUrl('')
      togglableRef.current.toggleVisibility()
      onSuccess(storedBlog)
    } catch (exception) {
      onError(exception)
    }
  }

  const togglableRef = useRef()

  return (
    <Togglable buttonLabel="new note" ref={togglableRef}>
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
