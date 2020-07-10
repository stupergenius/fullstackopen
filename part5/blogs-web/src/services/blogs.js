import axios from 'axios'

const baseUrl = '/api/blogs'

let authHeader = null

const setToken = (token) => {
  authHeader = `Bearer ${token}`
}

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const create = async (blog) => {
  const newBlog = await axios({
    method: 'post',
    url: baseUrl,
    data: blog,
    headers: {
      Authorization: authHeader,
    },
  })
  return newBlog.data
}

export default {
  setToken,
  getAll,
  create,
}
