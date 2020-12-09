import blogService from '../services/blogs'

const blogReducer = (state = [], action) => {
  switch (action.type) {
  case 'ADD_BLOG':
    return state.concat(action.data)
  case 'INIT_BLOGS':
    return action.data
  case 'LIKE_BLOG':
    return state.map(b => b.id === action.id
      ? { ...b, likes: b.likes + 1 }
      : b
    )
  case 'REMOVE_BLOG':
    return state.filter(b => b.id !== action.id)
  default:
    return state
  }
}

export const addBlog = blog => {
  return async dispatch => {
    const newBlog = await blogService.create(blog)
    dispatch({
      type: 'ADD_BLOG',
      data: newBlog
    })
    return newBlog
  }
}

export const initBlogs = () => {
  return async dispatch => {
    const blogs = await blogService.getAll()
    dispatch({
      type: 'INIT_BLOGS',
      data: blogs
    })
  }
}

export const likeBlog = (blog) => {
  return async (dispatch) => {
    const updatedBlog = { ...blog, likes: blog.likes + 1, user: blog.user && blog.user.id }
    await blogService.update(updatedBlog)
    dispatch({
      type: 'LIKE_BLOG',
      id: updatedBlog.id
    })
  }
}

export const removeBlog = (id) => {
  return async dispatch => {
    await blogService.remove(id)
    dispatch({
      type: 'REMOVE_BLOG',
      id
    })
  }
}

export default blogReducer
