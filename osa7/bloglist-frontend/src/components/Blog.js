import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { likeBlog, removeBlog } from '../reducers/blogReducer'
import { notify } from '../reducers/notificationReducer'

const Blog = ({ blog, user }) => {
  const [showAll, setShowAll] = useState(false)

  const dispatch = useDispatch()

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

  const toggleShowAll = () => setShowAll(!showAll)
  const buttonText = showAll ? 'hide' : 'view'

  const style = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  return (
    <div style={style}>
      {blog.title} {blog.author}
      <button onClick={toggleShowAll}>{buttonText}</button>
      {showAll &&
        <>
          <div>{blog.url}</div>
          <div>
            likes {blog.likes}
            <button onClick={() => handleLike(blog)}>like</button>
          </div>
          {blog.user &&
            <>
              <div>{blog.user && blog.user.name}</div>
              {blog.user.username === user.username &&
                <button
                  style={{ background: 'red', color: 'white' }}
                  onClick={() => handleDelete(blog)}
                >
                  remove
                </button>
              }
            </>
          }
        </>
      }
    </div>
  )
}

export default Blog
