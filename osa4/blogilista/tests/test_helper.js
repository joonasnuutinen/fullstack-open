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

/**
 * Add a suffix to the test database URI to avoid synchronization issues between
 * test suites.
 *
 * @param {String} sfx The suffix that identifies the test suite
 */
const setMongoTestURISuffix = (sfx) => {
  const uri = process.env.TEST_MONGODB_URI
  const sep = '?'
  const parts = uri.split(sep)
  parts[0] += `-${sfx}`
  process.env.TEST_MONGODB_URI = parts.join(sep)
}

module.exports = {
  initialBlogs,
  storedBlogs,
  storedUsers,
  nonExistingId,
  setMongoTestURISuffix,
}
