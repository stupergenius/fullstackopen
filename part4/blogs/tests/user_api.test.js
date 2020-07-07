const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')
const fixtures = require('./user_fixtures')
const User = require('../models/user')

const api = supertest(app)

beforeEach(async () => {
  await User.deleteMany({})

  const savePromises = fixtures.listWithManyUsers
    .map(user => new User(user))
    .map(user => user.save())

  await Promise.all(savePromises)
})

describe('creating users', () => {
  // test('inserting invalid user fails', async () => {
  //   await api
  //     .post('/api/users')
  //     .send({ username: 'ben' })
  //     .expect(400)
  //     .expect('Content-Type', /json/)
  //     .expect(({ body }) => {
  //       expect(body).toHaveProperty('error')
  //     })
  // })

  test('succeeds when given valid user data', async () => {
    const newUser = fixtures.factory()

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /json/)
      .expect(({ body }) => {
        expect(body).toHaveProperty('username', newUser.username)
        expect(body).toHaveProperty('name', newUser.name)
        expect(body).not.toHaveProperty('password')

        newUser.id = body.id
        delete newUser.password
      })

    await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /json/)
      .expect(({ body }) => {
        expect(body).toHaveLength(fixtures.listWithManyUsers.length + 1)
        expect(body).toContainEqual(expect.objectContaining(newUser))
      })
  })
})

afterAll(() => {
  mongoose.connection.close()
})
