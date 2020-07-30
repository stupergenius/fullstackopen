const toJson = (document, returnedObject) => {
  const transformed = returnedObject
  transformed.id = transformed._id.toString()
  delete transformed._id
  delete transformed.__v
  return transformed
}

module.exports = {
  toJson,
}
