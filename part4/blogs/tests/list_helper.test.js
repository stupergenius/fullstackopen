const listHelper = require('../utils/list_helper')
const fixtures = require('./blog_fixtures')

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)

  expect(result).toBe(1)
})

describe('total likes', () => {
  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(fixtures.listWithOneBlog)
    expect(result).toBe(5)
  })

  test('when list has only one blog with 0 likes return 0', () => {
    const result = listHelper.totalLikes([fixtures.listWithManyBlogs[4]])
    expect(result).toBe(0)
  })

  test('when list is empty to return 0', () => {
    const result = listHelper.totalLikes([])
    expect(result).toBe(0)
  })

  test('when list has more than one to return the total', () => {
    const result = listHelper.totalLikes(fixtures.listWithManyBlogs)
    expect(result).toBe(36)
  })
})

describe('favorite blogs', () => {
  test('returns null when no blogs given', () => {
    const result = listHelper.favoriteBlog([])
    expect(result).toBe(null)
  })

  test('returns the blog when single blog given', () => {
    const result = listHelper.favoriteBlog(fixtures.listWithOneBlog)
    expect(result).toEqual({
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      likes: 5,
    })
  })

  test('returns the blog with the highest likes', () => {
    const result = listHelper.favoriteBlog(fixtures.listWithManyBlogs)
    expect(result).toEqual({
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      likes: 12,
    })
  })

  test('returns the first blog with the highest likes when there is a tie', () => {
    const result = listHelper.favoriteBlog(fixtures.listWithTieBlogs)
    expect(result).toEqual({
      title: 'React patterns',
      author: 'Michael Chan',
      likes: 7,
    })
  })
})

describe('most blogs', () => {
  test('returns null when no blogs are given', () => {
    const resultNull = listHelper.mostBlogs(null)
    expect(resultNull).toBe(null)

    const resultEmpty = listHelper.mostBlogs([])
    expect(resultEmpty).toBe(null)
  })

  test('returns the author with the most blogs', () => {
    const result = listHelper.mostBlogs(fixtures.listWithManyBlogs)
    expect(result).toEqual({
      author: 'Robert C. Martin',
      blogs: 3,
    })
  })

  test('returns an author with the most blogs when there is a tie', () => {
    const result = listHelper.mostBlogs(fixtures.listWithManyBlogs.slice(0, -1))
    expect(result).not.toBe(null)
    expect(result.blogs).toBe(2)
  })

  test('returns the author when a single blog is given', () => {
    const result = listHelper.mostBlogs(fixtures.listWithOneBlog)
    expect(result).toEqual({
      author: 'Edsger W. Dijkstra',
      blogs: 1,
    })
  })
})

describe('most likes', () => {
  test('returns null when no blogs are given', () => {
    const resultNull = listHelper.mostLikes(null)
    expect(resultNull).toBe(null)

    const resultEmpty = listHelper.mostLikes([])
    expect(resultEmpty).toBe(null)
  })

  test('returns the author with the most likes', () => {
    const resultNull = listHelper.mostLikes(fixtures.listWithManyBlogs)
    expect(resultNull).toEqual({
      author: 'Edsger W. Dijkstra',
      likes: 17,
    })
  })

  test('returns the author when one blog given', () => {
    const resultNull = listHelper.mostLikes(fixtures.listWithOneBlog)
    expect(resultNull).toEqual({
      author: 'Edsger W. Dijkstra',
      likes: 5,
    })
  })

  test('returns an author with the most likes when there is a tie', () => {
    const result = listHelper.mostLikes(fixtures.listWithTieBlogs)
    expect(result).not.toBe(null)
    expect(result.likes).toBe(7)
  })
})
