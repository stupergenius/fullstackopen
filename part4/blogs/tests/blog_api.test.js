const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')
const fixtures = require('./blog_fixtures')
const Blog = require('../models/blog')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})

  const savePromises = fixtures.listWithManyBlogs
    .map(blog => new Blog(blog))
    .map(blog => blog.save())

  await Promise.all(savePromises)
})

describe('blogs api', () => {
  describe('retrieving blogs', () => {
    test('there are 6 blogs', async () => {
      await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /json/)
        .expect((res) => {
          expect(res.body).toHaveLength(6)
        })
    })

    test('returns an id property', async () => {
      await api
        .get('/api/blogs')
        .expect(200)
        .expect((res) => {
          for (const blog of res.body) {
            expect(blog).toHaveProperty('id')
          }
        })
    })
  })
})

afterAll(() => {
  mongoose.connection.close()
})
