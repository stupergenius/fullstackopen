import React, { useState } from 'react'
import PropTypes from 'prop-types'

const blogStyle = {
  paddingLeft: 2,
  border: 'solid',
  borderWidth: 1,
  marginBottom: 5,
}

const FullBlog = ({
  blog,
  onHide,
  onLike,
  onRemove,
  showRemove,
}) => (
  <p>
    {blog.title} <button type="button" onClick={onHide}>hide</button> <br />
    {blog.url} <br />
    likes {blog.likes} <button type="button" onClick={onLike}>like</button> <br />
    {blog.author} <br />
    {showRemove && <button type="button" onClick={onRemove}>remove</button>}
  </p>
)

const SimpleBlog = ({ blog, onView }) => (
  <p>
    {blog.title} {blog.author} <button type="button" onClick={onView}>view</button>
  </p>
)

const Blog = ({
  blog,
  onLike,
  onRemove,
  showRemove,
}) => {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div style={blogStyle}>
      {isExpanded
        ? (
          <FullBlog
            blog={blog}
            onHide={() => setIsExpanded(false)}
            onLike={() => onLike(blog)}
            onRemove={() => onRemove(blog)}
            showRemove={showRemove}
          />
        )
        : <SimpleBlog blog={blog} onView={() => setIsExpanded(true)} />}
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.shape({
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    likes: PropTypes.number.isRequired,
  }).isRequired,
  onLike: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  showRemove: PropTypes.bool,
}

Blog.defaultProps = {
  showRemove: false,
}

export default Blog
