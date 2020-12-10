require('dotenv').config()
const helper = require('./test_helper')
helper.setMongoTestURISuffix('blog_api')

const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const app = require('../app')

const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')

describe('when getting blogs', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
  })

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
  let auth
  beforeEach(async () => {
    await User.deleteMany({})
    await Blog.deleteMany({})

    // Add a user
    const passwordHash = await bcrypt.hash('notstrong', 10)
    const user = new User({ username: 'blogger', passwordHash })
    const token = jwt.sign({ username: user.username, id: user._id }, process.env.SECRET)
    auth = `bearer ${token}`
    await user.save()

    // Add initial blogs
    helper.initialBlogs.forEach(b => b.user = user._id)
    await Blog.insertMany(helper.initialBlogs)
  })

  test('succeeds with valid data', async () => {
    const newBlog = {
      title: 'Test blog',
      author: 'jest',
      url: 'https://jestjs.io/',
      likes: 12,
    }

    await api
      .post('/api/blogs')
      .set('Authorization', auth)
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
      .set('Authorization', auth)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

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
      .set('Authorization', auth)
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
      .set('Authorization', auth)
      .send(newBlog)
      .expect(400)

    const storedBlogs = await helper.storedBlogs()
    expect(storedBlogs).toHaveLength(helper.initialBlogs.length)
  })

  test('fails without a token', async () => {
    const newBlog = {
      title: 'Test blog',
      author: 'jest',
      url: 'https://jestjs.io/',
      likes: 12,
    }

    const result = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('token')
    const storedBlogs = await helper.storedBlogs()
    expect(storedBlogs).toHaveLength(helper.initialBlogs.length)
  })
})

describe('deleting a blog', () => {
  let auth
  beforeEach(async () => {
    await User.deleteMany({})
    await Blog.deleteMany({})

    // Add a user
    const passwordHash = await bcrypt.hash('notstrong', 10)
    const user = new User({ username: 'blogger', passwordHash })
    const token = jwt.sign({ username: user.username, id: user._id }, process.env.SECRET)
    auth = `bearer ${token}`
    await user.save()

    // Add initial blogs
    helper.initialBlogs.forEach(b => b.user = user._id)
    await Blog.insertMany(helper.initialBlogs)
  })
  test('succeeds with a valid id', async () => {
    const storedBlogs = await helper.storedBlogs()
    const blogToDelete = storedBlogs[0]
    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', auth)
      .expect(204)

    const storedBlogsAfterDeletion = await helper.storedBlogs()
    expect(storedBlogsAfterDeletion).toHaveLength(storedBlogs.length - 1)
    expect(storedBlogsAfterDeletion.map(b => b.id)).not.toContain(blogToDelete.id)
  })

  test('if id is not found returns status code 204 and does not affect database', async () => {
    const nonExistingId = await helper.nonExistingId()
    await api
      .delete(`/api/blogs/${nonExistingId}`)
      .set('Authorization', auth)
      .expect(204)
    const storedAfter = await helper.storedBlogs()
    expect(storedAfter).toHaveLength(helper.initialBlogs.length)
  })

  test('if id is invalid returns status code 400', async () => {
    const invalidId = '12345'
    await api
      .delete(`/api/blogs/${invalidId}`)
      .set('Authorization', auth)
      .expect(400)
    const storedAfter = await helper.storedBlogs()
    expect(storedAfter).toHaveLength(helper.initialBlogs.length)
  })
})

describe('updating a blog', () => {
  test('succeeds with valid data', async () => {
    const blogsBefore = await helper.storedBlogs()
    const b = blogsBefore[0]
    const body = {
      title: b.title,
      author: b.author,
      url: b.url,
      likes: b.likes + 1
    }
    await api
      .put(`/api/blogs/${b.id}`)
      .send(body)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogsAfter = await helper.storedBlogs()
    expect(blogsAfter.find(blog => blog.id === b.id).likes).toBe(body.likes)
  })

  test('if id does not exist returns status code 404', async () => {
    const blogToUpdate = { ...helper.initialBlogs[0] }
    const newLikes = blogToUpdate.likes + 1
    blogToUpdate.likes = newLikes
    const nonExistingId = await helper.nonExistingId()
    await api
      .put(`/api/blogs/${nonExistingId}`)
      .send(blogToUpdate)
      .expect(404)
  })

  test('if id is invalid returns status code 400', async () => {
    const blogToUpdate = { ...helper.initialBlogs[0] }
    const newLikes = blogToUpdate.likes + 1
    blogToUpdate.likes = newLikes
    const invalidId = '12345'
    await api
      .put(`/api/blogs/${invalidId}`)
      .send(blogToUpdate)
      .expect(400)
  })
})

afterAll(() => {
  mongoose.connection.close()
})
