import React, { useState } from 'react'
import PropTypes from 'prop-types'

const BlogForm = ({ createBlog }) => {
  const [newBlog, setNewBlog] = useState({ title: '', author: '', url: '' })

  const handleSubmitBlog = (event) => {
    event.preventDefault()

    createBlog(newBlog)
    setNewBlog({ title: '', author: '', url: '' })
  }

  return (
    <form onSubmit={handleSubmitBlog}>
      <div>
        title:
        <input
          type="text"
          value={newBlog.title}
          name="blog_title"
          onChange={({ target }) => setNewBlog({ ...newBlog, title: target.value })}
        />
      </div>
      <div>
        author:
        <input
          type="text"
          value={newBlog.author}
          name="blog_author"
          onChange={({ target }) => setNewBlog({ ...newBlog, author: target.value })}
        />
      </div>
      <div>
        url:
        <input
          type="text"
          value={newBlog.url}
          name="blog_url"
          onChange={({ target }) => setNewBlog({ ...newBlog, url: target.value })}
        />
      </div>
      <button type="submit">create</button>
    </form>
  )
}

BlogForm.propTypes = {
  createBlog: PropTypes.func.isRequired,
}

export default BlogForm
