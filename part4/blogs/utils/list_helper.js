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

module.exports = { dummy, totalLikes, favoriteBlog }
