import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Blog from './Blog'
import BlogForm from './BlogForm'
import { initBlogs } from '../reducers/blogReducer'

const BlogList = ({ handleDelete, user }) => {
  const dispatch = useDispatch()

  const sortedBlogs = useSelector(state => state.blogs.sort((b1, b2) => b2.likes - b1.likes))

  useEffect(() => {
    dispatch(initBlogs())
  }, [dispatch])

  return (
    <div>
      <h2>create new</h2>
      <BlogForm />
      <div id="blogs">
        {sortedBlogs.map(blog =>
          <Blog
            key={blog.id}
            blog={blog}
            handleDelete={handleDelete}
            user={user}
          />
        )}
      </div>
    </div>
  )
}

export default BlogList
