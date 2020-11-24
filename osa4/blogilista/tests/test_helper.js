const Blog = require('../models/blog')

const initialBlogs = [
  {
    title: 'First blog',
    author: 'Joonas',
    url: 'https://autua.fi',
    likes: 15,
  },
  {
    title: 'Second blog',
    author: 'Matti',
    url: 'https://fullstackopen.com/osa4/backendin_testaaminen',
    likes: 300,
  }
]

const storedBlogs = async () => {
  const blogs = await Blog.find({})
  return blogs.map(b => b.toJSON())
}

module.exports = {
  initialBlogs, storedBlogs
}
