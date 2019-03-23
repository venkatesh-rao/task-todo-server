import 'dotenv/config'
import * as session from 'express-session'
import { GraphQLServer } from 'graphql-yoga'
import * as mongoose from 'mongoose' // connector to connect to mongodb
import db from './models'
import resolvers from './resolvers'

export const startServer = async () => {
  // connect to remote mongodb (Mongodb Atlas)
  mongoose.connect(
    `mongodb+srv://${process.env.MONGO_USER}:${
      process.env.MONGO_PASSWORD
    }@cluster0-hekgs.mongodb.net/${process.env.MONGO_DB}?retryWrites=true`,
    { useCreateIndex: true, useNewUrlParser: true },
  )

  // create mongo connection to track db connection status
  const mongo = mongoose.connection

  // log on connection error
  mongo.on('error', error => {
    console.error('mongo: ' + error.name)
  })

  // log on successful connection
  mongo.on('connected', () => {
    console.log('mongo: Connected')
  })

  // log on disconnection
  mongo.on('disconnected', () => {
    console.warn('mongo: Disconnected')
  })

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
      secret: process.env.SESSION_SECRET || '',
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
