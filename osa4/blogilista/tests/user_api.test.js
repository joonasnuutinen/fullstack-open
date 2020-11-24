const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const app = require('../app')
const api = supertest(app)
const User = require('../models/user')
const helper = require('./test_helper')

describe('creating a user', () => {
  const initialUsername = 'root'

  beforeEach(async () => {
    await User.deleteMany({})
    const passwordHash = await bcrypt.hash('root', 10)
    const user = new User({ username: initialUsername, passwordHash })
    await user.save()
  })

  test('succeeds with valid data', async () => {
    const usersBefore = await helper.storedUsers()
    const newUser = {
      username: 'joonas',
      name: 'Joonas Nuutinen',
      password: 'jonttuli',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const usersAfter = await helper.storedUsers()
    expect(usersAfter).toHaveLength(usersBefore.length + 1)

    const usernames = usersAfter.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('fails if username is taken', async () => {
    const usersBefore = await helper.storedUsers()
    const newUser = {
      username: initialUsername,
      name: 'Käki Äimä',
      password: 'kukkuu'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('`username` to be unique')

    const usersAfter = await helper.storedUsers()
    expect(usersAfter).toHaveLength(usersBefore.length)
  })

  test('fails if username is missing', async () => {
    const usersBefore = await helper.storedUsers()
    const newUser = {
      name: 'Käki Äimä',
      password: 'kukkuu'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('`username` is required')

    const usersAfter = await helper.storedUsers()
    expect(usersAfter).toHaveLength(usersBefore.length)
  })

  test('fails if password is missing', async () => {
    const usersBefore = await helper.storedUsers()
    const newUser = {
      username: 'käki',
      name: 'Käki Äimä'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('`password` is required')

    const usersAfter = await helper.storedUsers()
    expect(usersAfter).toHaveLength(usersBefore.length)
  })

  test('fails if username is too short', async () => {
    const usersBefore = await helper.storedUsers()
    const newUser = {
      username: 'kä',
      name: 'Käki Äimä',
      password: 'kukkuu'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain(`\`username\` (\`${newUser.username}\`) is shorter than the minimum allowed length`)

    const usersAfter = await helper.storedUsers()
    expect(usersAfter).toHaveLength(usersBefore.length)
  })

  test('fails if password is too short', async () => {
    const usersBefore = await helper.storedUsers()
    const newUser = {
      username: 'käki',
      name: 'Käki Äimä',
      password: 'ku'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('`password` is shorter than the minimum allowed length')

    const usersAfter = await helper.storedUsers()
    expect(usersAfter).toHaveLength(usersBefore.length)
  })
})

afterAll(() => {
  mongoose.connection.close()
})
