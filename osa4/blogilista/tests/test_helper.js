const Blog = require('../models/blog')
const User = require('../models/user')

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

const storedUsers = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

const nonExistingId = async () => {
  const blog = new Blog({ title: 'temp', url: 'https://www.fi' })
  await blog.save()
  await blog.remove()
  return blog._id.toString()
}

module.exports = {
  initialBlogs,
  storedBlogs,
  storedUsers,
  nonExistingId,
}
