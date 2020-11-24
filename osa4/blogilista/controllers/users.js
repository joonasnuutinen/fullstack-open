const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
  const users = await User.find({})
  response.json(users)
})

usersRouter.post('/', async (request, response) => {
  const body = request.body

  if (!body.password) {
    return response.status(400).json({ error: 'User validation failed : password : Path `password` is required.' })
  }

  const pwMinLength = 3
  if (body.password.length < pwMinLength) {
    return response.status(400).json({ error: `User validation failed : password : Path \`password\` is shorter than the minimum allowed length (${pwMinLength}).` })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(body.password, saltRounds)

  const user = new User({
    username: body.username,
    name: body.name,
    passwordHash,
  })

  const savedUser = await user.save()

  response.json(savedUser)
})

module.exports = usersRouter
