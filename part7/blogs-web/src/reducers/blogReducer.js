import blogService from '../services/blogs'

export const likeAction = blog => async (dispatch) => {
  const votedBlog = await blogService.update(blog.id, { ...blog, likes: blog.likes + 1 })
  dispatch({
    type: 'LIKE',
    data: votedBlog,
  })
}

export const newBlogAction = content => async (dispatch) => {
  const blog = await blogService.create(content)
  dispatch({
    type: 'NEW_BLOG',
    data: blog,
  })
}

export const deleteBlogAction = id => async (dispatch) => {
  await blogService.delete(id)
  dispatch({
    type: 'DELETE_BLOG',
    data: { id },
  })
}

export const initBlogsAction = () => async (dispatch) => {
  const blogs = await blogService.getAll()
  dispatch({
    type: 'INIT_BLOGS',
    data: blogs,
  })
}

export const initBlogCommentsAction = blog => async (dispatch) => {
  const comments = await blogService.getComments(blog.id)
  dispatch({
    type: 'INIT_BLOG_COMMENTS',
    data: { blog, comments },
  })
}

const reducer = (state = [], action) => {
  switch (action.type) {
  case 'LIKE': {
    const liked = action.data
    return state.map(b => (b.id === liked.id ? liked : b))
  }
  case 'NEW_BLOG':
    return [...state, action.data]
  case 'DELETE_BLOG':
    return state.filter(b => b.id !== action.data.id)
  case 'INIT_BLOGS':
    return action.data
  case 'INIT_BLOG_COMMENTS': {
    const blog = { ...action.data.blog, comments: action.data.comments }
    return state.map(b => (b.id === blog.id ? blog : b))
  }
  default:
    return state
  }
}

export default reducer
