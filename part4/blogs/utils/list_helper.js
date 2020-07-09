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

const blogAggregate = (blogs, key, predicate) => {
  if (!Array.isArray(blogs) || blogs.length === 0) {
    return null
  }

  const counts = {}
  for (const blog of blogs) {
    counts[blog[key]] = (counts[blog[key]] || 0) + predicate(blog)
  }

  let maxAggregated = null
  for (const [blogKey, aggregate] of Object.entries(counts)) {
    if (maxAggregated === null || aggregate > maxAggregated.aggregate) {
      maxAggregated = { [key]: blogKey, aggregate }
    }
  }

  return maxAggregated
}

const mostBlogs = (blogs) => {
  const aggregated = blogAggregate(blogs, 'author', dummy) // cheeky
  return aggregated === null
    ? null
    : {
      author: aggregated.author,
      blogs: aggregated.aggregate,
    }
}

const mostLikes = (blogs) => {
  const aggregated = blogAggregate(blogs, 'author', blog => blog.likes)
  return aggregated == null
    ? null
    : {
      author: aggregated.author,
      likes: aggregated.aggregate,
    }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
}
