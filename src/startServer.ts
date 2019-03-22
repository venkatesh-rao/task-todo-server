import 'dotenv/config'
import * as session from 'express-session'
import { GraphQLServer } from 'graphql-yoga'
import db from './models'
import resolvers from './resolvers'

const SESSION_SECRET = 'ajslkjalksjdfkl'

export const startServer = async () => {
  const server = new GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers,
    context: ({ request }) => ({
      url: request.protocol + '://' + request.get('host'),
      session: request ? (request as Express.Request).session : undefined,
      req: request,
      db,
    }),
  })

  // session middleware
  server.express.use(
    session({
      name: 'qid',
      proxy: true,
      secret: process.env.SESSION_SECRET || SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year cookie
      },
    }),
  )

  const cors = {
    credentials: true,
    origin: process.env.FRONTEND_HOST as string,
  }

  const app = await server.start({
    cors,
    port: 8000,
  })
  console.log('Server is running on localhost:8000')

  return app
}
