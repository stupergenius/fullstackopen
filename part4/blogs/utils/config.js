const dotenv = require('dotenv')

dotenv.config()

const mongoUriName = process.env.NODE_ENV === 'test' ? 'TEST_MONGODB_URI' : 'MONGODB_URI'

const MONGODB_URI = process.env[mongoUriName]
const PORT = process.env.PORT || 3003
const { TOKEN_SECRET } = process.env

module.exports = {
  MONGODB_URI,
  PORT,
  TOKEN_SECRET,
}
