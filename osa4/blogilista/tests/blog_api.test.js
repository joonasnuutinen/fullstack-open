const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const helper = require('./test_helper')

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

test('notes are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all notes are returned', async () => {
  const response = await api.get('/api/blogs')
  expect(response.body).toHaveLength(helper.initialBlogs.length)
})

test('identifying field is named "id"', async () => {
  const response = await api.get('/api/blogs')
  response.body.forEach(blog => {
    expect(blog.id).toBeDefined()
    expect(blog._id).not.toBeDefined()
  })
})

test('new blog can be added', async () => {
  const newBlog = {
    title: 'Test blog',
    author: 'jest',
    url: 'https://jestjs.io/',
    likes: 12,
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const storedBlogs = await helper.storedBlogs()
  expect(storedBlogs).toHaveLength(helper.initialBlogs.length + 1)
  const storedBlogsMin = storedBlogs.map(b => {
    return { title: b.title, author: b.author, url: b.url, likes: b.likes }
  })
  expect(storedBlogsMin).toContainEqual(newBlog)
})

test('likes is 0 by default', async () => {
  const newBlog = {
    title: 'Test blog',
    author: 'jest',
    url: 'https://jestjs.io/',
  }

  await api
    .post('/api/blogs')
    .send(newBlog)

  const storedBlog = await Blog.findOne(newBlog)
  expect(storedBlog.likes).toBe(0)

})

test('new blog without a title gets rejected', async () => {
  const newBlog = {
    author: 'jest',
    url: 'https://jestjs.io/',
    likes: 12,
  }
  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)

  const storedBlogs = await helper.storedBlogs()
  expect(storedBlogs).toHaveLength(helper.initialBlogs.length)
})

test('new blog without a url gets rejected', async () => {
  const newBlog = {
    title: 'Test blog',
    author: 'jest',
    likes: 12,
  }
  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)

  const storedBlogs = await helper.storedBlogs()
  expect(storedBlogs).toHaveLength(helper.initialBlogs.length)
})

afterAll(() => {
  mongoose.connection.close()
})
