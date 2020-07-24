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

export const initBlogsAction = () => async (dispatch) => {
  const blogs = await blogService.getAll()
  dispatch({
    type: 'INIT_BLOGS',
    data: blogs,
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
  case 'INIT_BLOGS':
    return action.data
  default:
    return state
  }
}

export default reducer
