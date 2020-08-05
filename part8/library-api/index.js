const { ApolloServer, UserInputError } = require('apollo-server')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const jwt = require('jsonwebtoken')
const Book = require('./models/book')
const Author = require('./models/author')
const User = require('./models/user')
const typeDefs = require('./schema')

dotenv.config()
mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true)

console.log('connecting to', process.env.MONGODB_URI)

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })

const idResolver = obj => obj._id

const resolvers = {
  Query: {
    allBooks: (root, args) => {
      const query = {}
      if (args.genre && args.genre.length > 0) {
        query.genres = { $in: [args.genre] }
      }
      return Book.find(query)
    },
    allAuthors: () => Author.find({}),
    bookCount: () => Book.countDocuments({}),
    authorCount: () => Author.countDocuments({}),
    me: (root, args, context) => context.currentUser,
  },
  Author: {
    id: idResolver,
    bookCount: root => Book.countDocuments({ author: root.id }),
  },
  Book: {
    id: idResolver,
    author: root => Author.findById(root.author),
  },
  Mutation: {
    addBook: async (root, args, context) => {
      if (!context.currentUser) {
        throw new AuthenticationError("not authenticated")
      }

      const book = new Book({
        title: args.title,
        published: args.published,
        genres: args.genres,
      })

      let author = await Author.findOne({ name: args.author })
      if (author === null) {
        author = new Author({ name: args.author })
        await author.save()
      }
      book.author = author._id

      try {
        await book.save()
      } catch (e) {
        throw new UserInputError(e.message, {
          invalidArgs: args
        })
      }

      return book
    },
    editAuthor: async (root, args, context) => {
      if (!context.currentUser) {
        throw new AuthenticationError("not authenticated")
      }

      const author = await Author.findOne({ name: args.name })
      if (author === null) return null

      author.born = args.setBornTo

      try {
        await author.save()
      } catch (e) {
        throw new UserInputError(e.message, {
          invalidArgs: args
        })
      }

      return author
    },
    createUser: async (root, args) => {
      const user = new User({ username: args.username, favoriteGenre: args.favoriteGenre })

      try {
        return user.save()
      } catch (e) {
        throw new UserInputError(e.message, {
          invalidArgs: args,
        })
      }
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })

      if ( !user || args.password !== 'supersecret' ) {
        throw new UserInputError('wrong credentials')
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      }

      return { value: jwt.sign(userForToken, process.env.TOKEN_SECRET) }
    },
  },
}

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
