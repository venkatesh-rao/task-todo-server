import 'dotenv/config'
import { GraphQLServer } from 'graphql-yoga'
import resolvers from './resolvers'

export const startServer = async () => {
  const server = new GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers,
    context: req => ({
      ...req,
    }),
  })

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
