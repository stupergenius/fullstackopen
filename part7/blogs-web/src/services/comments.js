import axios from 'axios'

const baseUrl = '/api/blogs'

const urlFor = blogId => `${baseUrl}/${blogId}/comments`

const getAll = async (blogId) => {
  const response = await axios.get(urlFor(blogId))
  return response.data
}

const create = async (blogId, content) => {
  const response = await axios.post(urlFor(blogId), { content })
  return response.data
}

export default {
  getAll,
  create,
}
