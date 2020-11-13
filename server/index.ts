import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import Redis from "ioredis";
import { RedisPubSub } from "graphql-redis-subscriptions";
import path from "path";
import { buildSchema } from "type-graphql";
import { createServer } from 'http';
import { RecipeResolver } from "./recipe.resolver";
import express from "express";
import { createSchema, createApolloServer } from './graphql';

const app = express();

async function bootstrap() {
  // configure Redis connection options

  const schema = await createSchema();

  const httpServer = createServer(app);

  // Create GraphQL server
  const server = new ApolloServer({
    schema,
    playground: {
      settings: {
        'request.credentials': 'same-origin',
      },
    },
    subscriptions: {
      path: '/subscriptions'
    }
  });

  const apolloServer = await createApolloServer();

  apolloServer.applyMiddleware({app, cors: false });
  apolloServer.installSubscriptionHandlers(httpServer);
  // Start the server
  httpServer.listen(3001);
  console.log(`Server is running, GraphQL Playground available at 3001`);
}

bootstrap();
