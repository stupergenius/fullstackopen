const supertest = require('supertest')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const app = require('../app')
const tokenizer = require('../utils/tokenizer')
const crypto = require('../utils/crypto')
const fixtures = require('./blog_fixtures')
const userFixtures = require('./user_fixtures')
const Blog = require('../models/blog')
const User = require('../models/user')

const api = supertest(app)
let authUser = null

const createBlog = (blog, options = {}) => {
  const token = tokenizer.tokenizeSync({
    username: authUser.username,
    id: authUser._id.toString(),
  })

  return api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(blog)
    .expect(options.code || 201)
    .expect('Content-Type', /json/)
}

const deleteBlog = (id, options = {}) => {
  const token = tokenizer.tokenizeSync({
    username: authUser.username,
    id: authUser._id.toString(),
  })

  return api
    .delete(`/api/blogs/${id}`)
    .set('Authorization', `Bearer ${token}`)
    .expect(options.code || 204)
}

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  const newUserData = userFixtures.factory()
  newUserData.password = crypto.hashSync(newUserData.password)
  const newUser = new User(newUserData)
  await newUser.save()
  authUser = newUser

  const savePromises = fixtures.listWithManyBlogs
    .map((blog) => {
      const userBlog = { ...blog }
      userBlog.user = authUser._id
      return userBlog
    })
    .map(blog => new Blog(blog))
    .map(blog => blog.save())

  await Promise.all(savePromises)
})

describe('blogs api', () => {
  describe('blog authorization', () => {
    describe('creating blogs', () => {
      test('it fails when no user token is given', async () => {
        const newBlog = fixtures.factory()

        await api
          .post('/api/blogs')
          .send(newBlog)
          .expect(401)
          .expect('Content-Type', /json/)
          .expect(({ body }) => {
            expect(body).toHaveProperty('error', 'invalid token')
          })
      })

      test('it fails when an invalid token is given', async () => {
        const newBlog = fixtures.factory()

        await api
          .post('/api/blogs')
          .set('Authorization', 'Bearer asdlfksajlkj')
          .send(newBlog)
          .expect(401)
          .expect('Content-Type', /json/)
          .expect(({ body }) => {
            expect(body).toHaveProperty('error', 'invalid token')
          })
      })

      test('it fails when a forged token is given', async () => {
        const newBlog = fixtures.factory()
        const forgedToken = jwt.sign({
          username: 'hellas',
          id: '123',
        }, 'not the real secret')

        await api
          .post('/api/blogs')
          .set('Authorization', `Bearer ${forgedToken}`)
          .send(newBlog)
          .expect(401)
          .expect('Content-Type', /json/)
          .expect(({ body }) => {
            expect(body).toHaveProperty('error', 'invalid token')

            newBlog.id = body.id
          })
      })
    })

    describe('deleting blogs', () => {
      it('fails when no authorization is given', async () => {
        const toDelete = fixtures.listWithManyBlogs[0]

        await api
          .delete(`/api/blogs/${toDelete._id}`)
          .expect(401)
          .expect('Content-Type', /json/)
          .expect(({ body }) => {
            expect(body).toHaveProperty('error', 'invalid token')
          })
      })

      it('fails when the authenticated user is not the owner of a blog', async () => {
        const toDelete = fixtures.listWithManyBlogs[0]
        const token = tokenizer.tokenizeSync({
          username: 'not_a_real_user',
          id: 'sldfkjdlfkj',
        })

        await api
          .delete(`/api/blogs/${toDelete._id}`)
          .set('Authorization', `Bearer ${token}`)
          .expect(403)
          .expect('Content-Type', /json/)
          .expect(({ body }) => {
            expect(body).toHaveProperty('error', 'insufficient permission')
          })
      })
    })
  })

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

      await createBlog(newBlog)
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

    test('associates a new blog with the authenticated user', async () => {
      const newBlog = fixtures.factory()

      await createBlog(newBlog)
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
          expect(createdBlog.user).toHaveProperty('id', authUser._id.toString())
          expect(createdBlog.user).toHaveProperty('name', authUser.name)
        })

      await api
        .get('/api/users')
        .expect(200)
        .expect('Content-Type', /json/)
        .expect(({ body }) => {
          const blogUser = body.find(u => u.id === authUser._id.toString())
          expect(blogUser).toHaveProperty('id', authUser._id.toString())
          expect(blogUser).toHaveProperty('blogs')
          expect(blogUser.blogs.length).toBeGreaterThan(0)

          expect(blogUser.blogs.map(b => b.id)).toContain(newBlog.id)
        })
    })

    test('missing likes defaults to 0', async () => {
      const withoutLikes = fixtures.factory()
      delete withoutLikes.likes

      await createBlog(withoutLikes)
        .expect(({ body }) => {
          expect(body).toHaveProperty('likes', 0)
        })
    })

    test('fails when required properties are not given', async () => {
      const withoutTitle = fixtures.factory()
      delete withoutTitle.title

      const withoutUrl = fixtures.factory()
      delete withoutUrl.url

      await createBlog(withoutTitle, { code: 400 })

      await createBlog(withoutUrl, { code: 400 })
    })
  })

  describe('deleting blogs', () => {
    test('doesnt delete a non-existent blog', async () => {
      await deleteBlog('5efb8d9443df3806b12f48d3')

      await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /json/)
        .expect(({ body }) => {
          expect(body).toHaveLength(fixtures.listWithManyBlogs.length)
        })
    })

    test('returns an error when passing an invalid id', async () => {
      await deleteBlog('%20', { code: 400 })
        .expect('Content-Type', /json/)
        .expect(({ body }) => {
          expect(body).toHaveProperty('error', 'malformatted id')
        })
    })

    test('deletes a blog', async () => {
      const toDelete = fixtures.listWithManyBlogs[0]

      await deleteBlog(toDelete._id)

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
