const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
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

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(initialBlogs)
})

test('notes are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all notes are returned', async () => {
  const response = await api.get('/api/blogs')
  expect(response.body).toHaveLength(initialBlogs.length)
})

test('identifying field is named "id"', async () => {
  const response = await api.get('/api/blogs')
  response.body.forEach(blog => {
    expect(blog.id).toBeDefined()
    expect(blog._id).not.toBeDefined()
  })
})

afterAll(() => {
  mongoose.connection.close()
})
