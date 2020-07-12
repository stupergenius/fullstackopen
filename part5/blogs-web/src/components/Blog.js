import React, { useState } from 'react'

const blogStyle = {
  paddingLeft: 2,
  border: 'solid',
  borderWidth: 1,
  marginBottom: 5,
}

const FullBlog = ({ blog, onHide, onLike }) => (
  <p>
    {blog.title} <button type="button" onClick={onHide}>hide</button> <br />
    {blog.url} <br />
    likes {blog.likes} <button type="button" onClick={onLike}>like</button> <br />
    {blog.author}
  </p>
)

const SimpleBlog = ({ blog, onView }) => (
  <p>
    {blog.title} {blog.author} <button type="button" onClick={onView}>view</button>
  </p>
)

const Blog = ({ blog, onLike }) => {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div style={blogStyle}>
      {isExpanded
        ? <FullBlog blog={blog} onHide={() => setIsExpanded(false)} onLike={() => onLike(blog)} />
        : <SimpleBlog blog={blog} onView={() => setIsExpanded(true)} />}
    </div>
  )
}

export default Blog
