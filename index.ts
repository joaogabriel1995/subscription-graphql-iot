import 'reflect-metadata'

import path from 'path'
import { ApolloServer } from 'apollo-server'
import { useServer } from 'graphql-ws/lib/use/ws'
import { buildSchema } from 'type-graphql'
import { UserResolver } from './src/resolvers/UserResolver'
import cors from 'cors'
import express from 'express'
import { WebSocketServer } from 'ws'
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core'
import bodyParser from 'body-parser'
import { createServer } from 'http'

async function main() {
  const schema = await buildSchema({
    resolvers: [UserResolver],
    emitSchemaFile: path.resolve(__dirname, 'schema.gql')
  })
  const app = express()
  const httpServer = createServer(app)

  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/graphql'
  })

  const serverCleanup = useServer({ schema }, wsServer)

  const server = new ApolloServer({
    schema,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose()
            }
          }
        }
      }
    ]
  })
  await server.listen()
  app.use('/graphql', cors<cors.CorsRequest>(), bodyParser.json())
  const PORT = 4001
  // Now that our HTTP server is fully set up, we can listen to it.
  httpServer.listen(PORT, () => {
    console.log(`Server is now running on http://localhost:${PORT}/graphql`)
  })
}
main()
