import { ApolloServer } from "@apollo/server";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { expressMiddleware } from "@apollo/server/express4";
import {makeExecutableSchema} from "@graphql-tools/schema" 
import express from 'express';
import http from 'http';
import typeDefs from './graphql/typeDefs';
import resolvers from './graphql/resolvers';
import * as dotenv from "dotenv"
import {getSession} from "next-auth/react"
import { GraphQLContext, Session, SubscriptionContext } from './util/types';
import {PrismaClient} from "@prisma/client"
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';
import { PubSub } from 'graphql-subscriptions';
import cors from "cors";
import { json } from "body-parser";

async function main() {
    dotenv.config()
  const app = express();
  const httpServer = http.createServer(app);

  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/graphql/subscriptions',
  });

    const schema = makeExecutableSchema({
        typeDefs,
        resolvers,
    })

    const prisma = new PrismaClient()

    const pubsub = new PubSub();

    const getSubscriptionContext = async (
      ctx: SubscriptionContext
    ): Promise<GraphQLContext> => {
      ctx;
      // ctx is the graphql-ws Context where connectionParams live
      if (ctx.connectionParams && ctx.connectionParams.session) {
        const { session } = ctx.connectionParams;
        return { session, prisma, pubsub };
      }
      // Otherwise let our resolvers know we don't have a current user
      return { session: null, prisma, pubsub };
    };
  
    // Save the returned server's info so we can shutdown this server later
    const serverCleanup = useServer(
      {
        schema,
        context: (ctx: SubscriptionContext) => {
          // This will be run every time the client sends a subscription request
          // Returning an object will add that information to our
          // GraphQL context, which all of our resolvers have access to.
          return getSubscriptionContext(ctx);
        },
      },
      wsServer
    );

    

    

  const server = new ApolloServer({
    schema,
    csrfPrevention: true,
    
    plugins: [
      // Proper shutdown for the HTTP server.
      ApolloServerPluginDrainHttpServer({ httpServer }),
  
      // Proper shutdown for the WebSocket server.
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
    ],
  });
  await server.start();
  
  const corsOptions = {
    origin: process.env.CLIENT_ORIGIN,
    credentials: true,
  };

  app.use(
    "/graphql",
    cors<cors.CorsRequest>(corsOptions),
    json(),
    expressMiddleware(server, {
      context: async ({ req }): Promise<GraphQLContext> => {
        const session = await getSession({ req });

        return { session: session as Session, prisma, pubsub };
      },
    })
  );

  const PORT = 4000;
  
  await new Promise<void>((resolve) =>
    httpServer.listen({ port: PORT }, resolve)
  );

  console.log(`Server is now running on http://localhost:${PORT}/graphql`);
}

main().catch(err=>console.log(err))