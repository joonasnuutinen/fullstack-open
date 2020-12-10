import React from 'react'
import { useSelector } from 'react-redux'
import BlogForm from './BlogForm'

const BlogList = () => {
  const sortedBlogs = useSelector(state => state.blogs.sort((b1, b2) => b2.likes - b1.likes))

  const style = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  return (
    <div>
      <h2>create new</h2>
      <BlogForm />
      <div id="blogs">
        {sortedBlogs.map(blog =>
          <div key={blog.id} style={style}>
            <a key={blog.id} href={`/blogs/${blog.id}`}>{blog.title} {blog.author}</a>
          </div>
        )}
      </div>
    </div>
  )
}

export default BlogList
