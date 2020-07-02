const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')
const fixtures = require('./blog_fixtures')
const Blog = require('../models/blog')
const blog_fixtures = require('./blog_fixtures')

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
      const newBlog = fixtures.factory()

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

    test('missing likes defaults to 0', async () => {
      const withoutLikes = fixtures.factory()
      delete withoutLikes.likes

      await api
        .post('/api/blogs')
        .send(withoutLikes)
        .expect(201)
        .expect('Content-Type', /json/)
        .expect(({ body }) => {
          expect(body).toHaveProperty('likes', 0)
        })
    })

    test('fails when required properties are not given', async () => {
      const withoutTitle = fixtures.factory()
      delete withoutTitle.title

      const withoutUrl = fixtures.factory()
      delete withoutUrl.url

      await api
        .post('/api/blogs')
        .send(withoutTitle)
        .expect(400)

      await api
        .post('/api/blogs')
        .send(withoutUrl)
        .expect(400)
    })
  })

  describe('deleting blogs', () => {
    test('doesnt delete a non-existent blog', async () => {
      await api.delete('/api/blogs/1234')

      await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /json/)
        .expect(({ body }) => {
          expect(body).toHaveLength(fixtures.listWithManyBlogs.length)
        })
    })

    test('returns an error when passing an invalid id', async () => {
      await api
        .delete('/api/blogs/%20')
        .expect(400)
        .expect('Content-Type', /json/)
        .expect(({ body }) => {
          expect(body).toHaveProperty('error')
        })
    })

    test('deletes a blog', async () => {
      const toDelete = fixtures.listWithManyBlogs[0]

      await api
        .delete(`/api/blogs/${toDelete._id}`)
        .expect(204)

      await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /json/)
        .expect(({ body }) => {
          expect(body).toHaveLength(fixtures.listWithManyBlogs.length - 1)
          expect(body.map(blog => blog.id)).not.toContain(toDelete._id)
        })
    })
  })
})

afterAll(() => {
  mongoose.connection.close()
})
