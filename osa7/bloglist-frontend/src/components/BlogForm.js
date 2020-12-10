import React, { useRef } from 'react'
import { useDispatch } from 'react-redux'
import Togglable from './Togglable'
import { TextInput } from './Input'
import { addBlog } from '../reducers/blogReducer'
import { notify } from '../reducers/notificationReducer'

const BlogForm = () => {
  const dispatch = useDispatch()

  const handleSubmit = async e => {
    e.preventDefault()

    const newBlog = {
      title: e.target.title.value,
      author: e.target.author.value,
      url: e.target.url.value
    }

    try {
      const storedBlog = await dispatch(addBlog(newBlog))
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
        <TextInput label="title" name="title" />
        <TextInput label="author" name="author" />
        <TextInput label="url" name="url" />
        <button type="submit">create</button>
      </form>
    </Togglable>
  )
}

export default BlogForm
