const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')
const fixtures = require('./blog_fixtures')
const userFixtures = require('./user_fixtures')
const Blog = require('../models/blog')
const User = require('../models/user')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  const newUser = new User(userFixtures.factory())
  await newUser.save()

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

    test('associates a new blog with a user', async () => {
      const newBlog = fixtures.factory()
      let blogUserId = null

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

          const createdBlog = body.find(b => b.id === newBlog.id)
          expect(createdBlog).toHaveProperty('id', newBlog.id)
          expect(createdBlog).toHaveProperty('user')
          expect(createdBlog.user).toHaveProperty('id')
          expect(createdBlog.user).toHaveProperty('name')

          blogUserId = createdBlog.user.id
        })

      await api
        .get('/api/users')
        .expect(200)
        .expect('Content-Type', /json/)
        .expect(({ body }) => {
          const blogUser = body.find(u => u.id === blogUserId)
          expect(blogUser).toHaveProperty('id', blogUserId)
          expect(blogUser).toHaveProperty('blogs')
          expect(blogUser.blogs.length).toBeGreaterThan(0)

          expect(blogUser.blogs.map(b => b.id)).toContain(newBlog.id)
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

  describe('updating blogs', () => {
    test('doesnt update a non-existent blog', async () => {
      await api
        .put('/api/blogs/1234')
        .expect(400)
        .expect('Content-Type', /json/)
        .expect(({ body }) => {
          expect(body).toHaveProperty('error')
        })
    })

    test('returns an error when passing an invalid id', async () => {
      await api
        .put('/api/blogs/%20')
        .expect(400)
        .expect('Content-Type', /json/)
        .expect(({ body }) => {
          expect(body).toHaveProperty('error')
        })
    })

    test('updates likes, etc.', async () => {
      const toUpdate = fixtures.listWithManyBlogs[0]
      toUpdate.author = 'me'
      toUpdate.likes = Math.round(Math.random() * 1000)

      await api
        .put(`/api/blogs/${toUpdate._id}`)
        .send(toUpdate)
        .expect(200)
        .expect('Content-Type', /json/)
        .expect(({ body }) => {
          expect(body).toHaveProperty('likes', toUpdate.likes)
          expect(body).toHaveProperty('author', toUpdate.author)
        })
    })
  })
})

afterAll(() => {
  mongoose.connection.close()
})
