const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')
const fixtures = require('./user_fixtures')
const blogFixtures = require('./blog_fixtures')
const User = require('../models/user')
const Blog = require('../models/blog')

const api = supertest(app)

beforeEach(async () => {
  await User.deleteMany({})
  await Blog.deleteMany({})

  const blogSavePromises = blogFixtures.listWithManyBlogs
    .map(blog => new Blog(blog))
    .map(blog => blog.save())

  await Promise.all(blogSavePromises)

  const allBlogs = await Blog.find({})

  const savePromises = fixtures.listWithManyUsers
    .map((user) => {
      const userWithBlog = { ...user }
      userWithBlog.blogs = allBlogs
        .filter(blog => userWithBlog.blogs.includes(blog._id.toString()))
        .map(blog => blog._id)
      return userWithBlog
    })
    .map(user => new User(user))
    .map(user => user.save())

  await Promise.all(savePromises)
})

describe('listing users', () => {
  test('lists users with associated blogs', async () => {
    await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /json/)
      .expect(({ body }) => {
        expect(body).toHaveLength(fixtures.listWithManyUsers.length)

        const user = body[0]
        expect(user).toHaveProperty('id')
        expect(user).toHaveProperty('username')
        expect(user).toHaveProperty('blogs')
        expect(user.blogs.length).toBeGreaterThan(0)
        expect(user.blogs[0]).toHaveProperty('author')
        expect(user.blogs[0]).toHaveProperty('id')
      })
  })
})

describe('creating users', () => {
  test('inserting user without required fields fails', async () => {
    await api
      .post('/api/users')
      .send({ username: 'ben' })
      .expect(400)
      .expect('Content-Type', /json/)
      .expect(({ body }) => {
        expect(body.error).toContain('`password` is required')
      })

    await api
      .post('/api/users')
      .send({ password: 'fffff' })
      .expect(400)
      .expect('Content-Type', /json/)
      .expect(({ body }) => {
        expect(body.error).toContain('`username` is required')
      })
  })

  test('inserting user with invalid fields fails', async () => {
    const newUser = fixtures.factory()

    await api
      .post('/api/users')
      .send({ ...newUser, username: 'ka' })
      .expect(400)
      .expect('Content-Type', /json/)
      .expect(({ body }) => {
        expect(body.error).toContain('username` (`ka`) is shorter than the minimum allowed length')
      })

    await api
      .post('/api/users')
      .send({ ...newUser, password: 'ka' })
      .expect(400)
      .expect('Content-Type', /json/)
      .expect(({ body }) => {
        expect(body.error).toContain('password` (`ka`) is shorter than the minimum allowed length')
      })
  })

  test('inserting duplicate user fails', async () => {
    await api
      .post('/api/users')
      .send(fixtures.listWithManyUsers[0])
      .expect(400)
      .expect('Content-Type', /json/)
      .expect(({ body }) => {
        expect(body.error).toContain('`username` to be unique')
      })
  })

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
