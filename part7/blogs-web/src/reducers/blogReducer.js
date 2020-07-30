import blogService from '../services/blogs'
import commentService from '../services/comments'
import { showErrorNotificationAction, showSuccessNotificationAction } from './notificationReducer'

export const likeAction = blog => async (dispatch) => {
  try {
    const votedBlog = await blogService.update(blog.id, { ...blog, likes: blog.likes + 1 })
    dispatch({
      type: 'LIKE',
      data: votedBlog,
    })
  } catch (error) {
    dispatch(showErrorNotificationAction(`Error liking blog: ${error.message}`))
  }
}

export const newBlogAction = content => async (dispatch) => {
  try {
    const blog = await blogService.create(content)
    dispatch({
      type: 'NEW_BLOG',
      data: blog,
    })
    dispatch(showSuccessNotificationAction(`a new blog ${blog.title} by ${blog.author} added`))
  } catch (error) {
    dispatch(showErrorNotificationAction(`Error creating blog: ${error.message}`))
  }
}

export const deleteBlogAction = blog => async (dispatch) => {
  try {
    await blogService.delete(blog.id)
    dispatch({
      type: 'DELETE_BLOG',
      data: { id: blog.id },
    })
    dispatch(showSuccessNotificationAction(`Deleted blog: ${blog.title}`))
  } catch (error) {
    dispatch(showErrorNotificationAction(`Error deleting blog: ${blog.title}`))
  }
}

export const initBlogsAction = () => async (dispatch) => {
  const blogs = await blogService.getAll()
  dispatch({
    type: 'INIT_BLOGS',
    data: blogs,
  })
}

export const initBlogCommentsAction = blogId => async (dispatch) => {
  const comments = await commentService.getAll(blogId)
  dispatch({
    type: 'INIT_BLOG_COMMENTS',
    data: { blogId, comments },
  })
}

export const addBlogCommentAction = (blogId, content) => async (dispatch) => {
  try {
    const comment = await commentService.create(blogId, content)
    dispatch({
      type: 'ADD_BLOG_COMMENTS',
      data: { blogId, comment },
    })
  } catch (error) {
    dispatch(showErrorNotificationAction(`Error commenting on blog: ${error.message}`))
  }
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
    const existingBlog = state.find(b => b.id === action.data.blogId)
    const blog = { ...existingBlog, comments: action.data.comments }
    return state.map(b => (b.id === blog.id ? blog : b))
  }
  case 'ADD_BLOG_COMMENTS': {
    const existingBlog = state.find(b => b.id === action.data.blogId)
    const newComments = Array.isArray(existingBlog.comments)
      ? existingBlog.comments.concat(action.data.comment)
      : [action.data.comment]
    const blog = { ...existingBlog, comments: newComments }
    return state.map(b => (b.id === blog.id ? blog : b))
  }
  default:
    return state
  }
}

export default reducer
