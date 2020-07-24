// A morgan compatible token implementation to log the post body

const token = (req) => {
  const method = req.method.toLowerCase()
  if ((method !== 'post' && method !== 'put') || !req.body) {
    return null
  }

  return JSON.stringify(req.body)
}

module.exports = token
