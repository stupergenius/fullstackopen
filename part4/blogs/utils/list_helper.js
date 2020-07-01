const dummy = () => 1

const totalLikes = blogs => blogs.reduce((total, blog) => blog.likes + total, 0)

const favoriteBlog = (blogs) => {
  if (!Array.isArray(blogs)) {
    return null
  }

  let mostLikes = 0
  let favBlog = null
  for (const blog of blogs) {
    if (blog.likes > mostLikes) {
      mostLikes = blog.likes
      favBlog = blog
    }
  }

  if (favBlog === null) {
    return null
  }

  return {
    title: favBlog.title,
    author: favBlog.author,
    likes: favBlog.likes,
  }
}

const mostBlogs = (blogs) => {
  if (!Array.isArray(blogs) || blogs.length === 0) {
    return null
  }

  const authorCounts = {}
  for (const blog of blogs) {
    authorCounts[blog.author] = (authorCounts[blog.author] || 0) + 1
  }

  let authorWithMost = { blogs: 0 }
  for (const [author, numBlogs] of Object.entries(authorCounts)) {
    if (numBlogs > authorWithMost.blogs) {
      authorWithMost = { author, blogs: numBlogs }
    }
  }

  return authorWithMost
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
}
