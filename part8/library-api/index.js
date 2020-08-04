const { ApolloServer, gql, UserInputError } = require('apollo-server')
const mongoose = require('mongoose')
const Book = require('./models/book')
const Author = require('./models/author')
const dotenv = require('dotenv')

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

// const booksByAuthor = books.reduce((acc, book) => {
//   acc[book.author] = [...acc[book.author] || [], book]
//   return acc
// }, {})

// const augmentAuthor = a => ({ ...a, bookCount: (booksByAuthor[a.name] || []).length })

const typeDefs = gql`
  type Book {
    id: ID!
    title: String!
    published: Int!
    author: Author!
    genres: [String!]!
  }

  type Author {
    id: ID!
    name: String!
    born: Int
    bookCount: Int!
  }

  type Mutation {
    addBook(
      title: String!
      published: Int!
      author: String!
      genres: [String!]!
    ): Book

    editAuthor(
      name: String!
      setBornTo: Int
    ): Author
  }

  type Query {
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
    bookCount: Int!
    authorCount: Int!
  }
`

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
    addBook: async (root, args) => {
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
    editAuthor: async (root, args) => {
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
    }
  },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

const port = process.env.PORT || 4000
server.listen({ port }).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})
