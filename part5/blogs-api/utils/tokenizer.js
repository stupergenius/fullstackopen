const jwt = require('jsonwebtoken')
const config = require('./config')

const tokenizeSync = data => jwt.sign(data, config.TOKEN_SECRET)

const tokenize = data => new Promise((resolve, reject) => {
  jwt.sign(data, config.TOKEN_SECRET, (error, encoded) => {
    if (error || !encoded) {
      reject(error)
    } else {
      resolve(encoded)
    }
  })
})

const verifySync = token => jwt.verify(token, config.TOKEN_SECRET)

const verify = data => new Promise((resolve, reject) => {
  jwt.verify(data, config.TOKEN_SECRET, (error, decoded) => {
    if (error || !decoded) {
      reject(error)
    } else {
      resolve(decoded)
    }
  })
})

module.exports = {
  tokenizeSync,
  tokenize,
  verifySync,
  verify,
}
