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
        .expect(({ body }) => {
          expect(body).toHaveLength(fixtures.listWithManyBlogs.length)
        })
    })

    test('returns an id property', async () => {
      await api
        .get('/api/blogs')
        .expect(200)
        .expect(({ body }) => {
          for (const blog of body) {
            expect(blog).toHaveProperty('id')
          }
        })
    })
  })

  describe('creating blogs', () => {
    test('inserts a new blog into the list', async () => {
      const newBlog = {
        title: 'Something something rust',
        author: 'Ben',
        url: 'http://rust.example.com',
        likes: 27,
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /json/)
        .expect(({ body }) => {
          expect(body).toHaveProperty('id')
          expect(body).toEqual(expect.objectContaining(newBlog))

          newBlog.id = body.id
        })

      await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /json/)
        .expect(({ body }) => {
          expect(body).toHaveLength(fixtures.listWithManyBlogs.length + 1)
          expect(body).toContainEqual(expect.objectContaining(newBlog))
        })
    })
  })
})

afterAll(() => {
  mongoose.connection.close()
})
