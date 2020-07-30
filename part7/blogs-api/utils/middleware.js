const morgan = require('morgan')
const logger = require('./logger')
const postBodyToken = require('./postbody_token')

morgan.token('post-body', postBodyToken)

const requestLogger = (process.env.NODE_ENV === 'test')
  ? null
  : morgan(':method :url :status :res[content-length] - :response-time ms :post-body')

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }
  if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  if (error.name === 'JsonWebTokenError' || error.name === 'NotBeforeError' || error.name === 'TokenExpiredError') {
    return response.status(401).json({ error: 'invalid token' })
  }

  logger.error(error.message)

  next(error)
}

const tokenExtractor = async (request, response, next) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    request.token = authorization.substring(7)
  }

  next()
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
}
