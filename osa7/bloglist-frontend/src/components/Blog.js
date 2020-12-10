import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { likeBlog, removeBlog } from '../reducers/blogReducer'
import { notify } from '../reducers/notificationReducer'

const Comments = ({ comments }) => {
  console.log(comments, comments.map)
  if (comments.length === 0) {
    return <p>No comments</p>
  }

  return (
    <ul>
      {comments.map(c => <li key={c}>{c}</li>)}
    </ul>
  )
}

const Blog = () => {
  const dispatch = useDispatch()

  const [blogs, user] = useSelector(state => [state.blogs, state.users.current])
  const id = useParams().id
  const blog = blogs.find(b => b.id === id)

  if (!blog) return null
  console.log(blog)

  const handleLike = () => {
    dispatch(likeBlog(blog))
  }

  const handleDelete = async () => {
    const blogInfo = `${blog.title} by ${blog.author}`
    if (!window.confirm(`Remove blog ${blogInfo}`)) return
    try {
      await dispatch(removeBlog(blog.id))
      dispatch(notify(`Successfully removed ${blogInfo}`, 'success'))
    } catch (exception) {
      dispatch(notify('An error occurred when attempting to remove the blog', 'error'))
    }
  }

  return (
    <div>
      <h2>{blog.title} {blog.author}</h2>
      <div>
        <a href={blog.url}>{blog.url}</a>
      </div>
      <div>
        {blog.likes} likes
        <button onClick={() => handleLike(blog)}>like</button>
      </div>
      <div>added by {blog.user.name}</div>
      {blog.user.username === user.username &&
        <button
          style={{ background: 'red', color: 'white' }}
          onClick={() => handleDelete(blog)}
        >
          remove
        </button>
      }

      <h3>comments</h3>
      <Comments comments={blog.comments} />
    </div>
  )
}

export default Blog
