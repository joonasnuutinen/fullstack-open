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

describe('when getting blogs', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
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
})

describe('adding a new blog', () => {
  test('succeeds with valid data', async () => {
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

  test('sets likes to zero by default', async () => {
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

  test('without a title is rejected with status code 400', async () => {
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

  test('without a url is rejected with status code 400', async () => {
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
})

describe('deleting a blog', () => {
  test('succeeds with a valid id', async () => {
    const storedBlogs = await helper.storedBlogs()
    const blogToDelete = storedBlogs[0]
    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)

    const storedBlogsAfterDeletion = await helper.storedBlogs()
    expect(storedBlogsAfterDeletion).toHaveLength(storedBlogs.length - 1)
    expect(storedBlogsAfterDeletion.map(b => b.id)).not.toContain(blogToDelete.id)
  })

  test('if id is not found returns status code 204 and does not affect database', async () => {
    const nonExistingId = await helper.nonExistingId()
    await api
      .delete(`/api/blogs/${nonExistingId}`)
      .expect(204)
    const storedAfter = await helper.storedBlogs()
    expect(storedAfter).toHaveLength(helper.initialBlogs.length)
  })

  test('if id is invalid returns status code 400', async () => {
    const invalidId = '12345'
    await api
      .delete(`/api/blogs/${invalidId}`)
      .expect(400)
    const storedAfter = await helper.storedBlogs()
    expect(storedAfter).toHaveLength(helper.initialBlogs.length)
  })
})

afterAll(() => {
  mongoose.connection.close()
})
