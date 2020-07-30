const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')
const tokenizer = require('../utils/tokenizer')
const crypto = require('../utils/crypto')
const config = require('../utils/config')
const fixtures = require('./user_fixtures')
const User = require('../models/user')

const api = supertest(app)

beforeEach(async () => {
  await User.deleteMany({})

  const savePromises = fixtures.listWithManyUsers
    .map(user => ({
      ...user,
      password: crypto.hashSync(user.password),
    }))
    .map(user => new User(user))
    .map(user => user.save())

  await Promise.all(savePromises)
})

describe('login', () => {
  test('it should return a token for a valid user', async () => {
    const user = fixtures.listWithManyUsers[0]

    await api
      .post('/api/login')
      .send(user)
      .expect(200)
      .expect('Content-Type', /json/)
      .expect(({ body }) => {
        expect(body).toHaveProperty('token')
        expect(body.token.length).toBeGreaterThan(0)
        expect(body).toHaveProperty('username', user.username)
      })
  })

  test('it should return a valid signed JWT token', async () => {
    const userData = fixtures.listWithManyUsers[0]
    const user = await User.findOne({ username: userData.username })

    await api
      .post('/api/login')
      .send(userData)
      .expect(200)
      .expect('Content-Type', /json/)
      .expect(({ body }) => {
        expect(body).toHaveProperty('token')

        const tokenData = tokenizer.verifySync(body.token)
        expect(tokenData).toMatchObject({
          username: user.username,
          id: user._id.toString(),
        })
      })
  })

  test('it should return an error for an invalid password', async () => {
    const user = {
      ...fixtures.listWithManyUsers[0],
      password: 'the wrong password',
    }

    await api
      .post('/api/login')
      .send(user)
      .expect(401)
      .expect('Content-Type', /json/)
      .expect(({ body }) => {
        expect(body).toHaveProperty('error')
        expect(body.error).toMatch(/invalid username or password/)
      })
  })

  test('it should return an error for a non-existent user', async () => {
    const user = {
      ...fixtures.listWithManyUsers[0],
      username: 'not_a_real_user',
    }

    await api
      .post('/api/login')
      .send(user)
      .expect(401)
      .expect('Content-Type', /json/)
      .expect(({ body }) => {
        expect(body).toHaveProperty('error')
        expect(body.error).toMatch(/invalid username or password/)
      })
  })
})

afterAll(() => {
  mongoose.connection.close()
})
