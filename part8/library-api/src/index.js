const { ApolloServer } = require('apollo-server')
const dotenv = require('dotenv')
const jwt = require('jsonwebtoken')
const db = require('./db')
const resolvers = require('./resolvers')
const typeDefs = require('./schema')
const User = require('./models/user')

dotenv.config()
db.init()

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const auth = req ? req.headers.authorization : null
    if (auth && auth.toLowerCase().startsWith('bearer ')) {
      const decodedToken = jwt.verify(auth.substring(7), process.env.TOKEN_SECRET)
      const currentUser = await User.findById(decodedToken.id)
      return { currentUser }
    }
  }
})

const port = process.env.PORT || 4000
server.listen({ port }).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})
