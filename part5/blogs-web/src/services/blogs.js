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
  const response = await axios({
    method: 'post',
    url: baseUrl,
    data: blog,
    headers: {
      Authorization: authHeader,
    },
  })
  return response.data
}

const update = async (id, blog) => {
  const response = await axios.put(`${baseUrl}/${id}`, blog)
  return response.data
}

export default {
  setToken,
  getAll,
  create,
  update,
}
