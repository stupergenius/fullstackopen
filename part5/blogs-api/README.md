# Blogs API

Provides an API for blogs over a MongoDB database.

## Development Setup

1. Run `npm install`
2. Create a `.env` file in the root directory containing (e.g. by copying the `.env.sample` file), providing environment variable values for:
   1. A `MONGODB_URI` value containing a full MongoDB database connection string pointing at the blog mongodb database you would like to use
   2. A `TEST_MONGODB_URI` value containing a full MongoDB database connection string pointing at the blog mongodb database you would like to use when running tests (via `npm test`)
   3. A `TOKEN_SECRET` string used for generating signed JWTs
   4. Optionally, a `PORT` value that the server will listen on. Default port is `3003` if not specified.
3. Run `npm run dev`