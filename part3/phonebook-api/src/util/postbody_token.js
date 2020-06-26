// A morgan compatible token implementation to log the post body

const token = (req) => {
  if (req.method.toLowerCase() !== 'post' || !req.body) {
    return null
  }

  return JSON.stringify(req.body)
}

module.exports = token
