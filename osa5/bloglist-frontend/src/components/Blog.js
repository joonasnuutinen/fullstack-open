import React, { useState } from 'react'

const Blog = ({ blog, handleLike, handleDelete, user }) => {
  const [showAll, setShowAll] = useState(false)

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
