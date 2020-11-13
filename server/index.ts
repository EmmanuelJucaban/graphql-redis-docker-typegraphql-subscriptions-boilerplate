import "reflect-metadata";
import { createServer } from 'http';
import { connect, set } from "mongoose";
import {  createApolloServer } from './graphql';

import { app } from './server';

export const connectToDb = () => {
  console.log('ENV', process.env.MONGODB_URI);
  connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
    .then(() => console.log('db connected'))
    .catch((e) => console.log('Connection failed', e));
};

async function bootstrap() {
  // configure Redis connection options
  set('debug', true);
  connectToDb();
  const httpServer = createServer(app);

  // Create GraphQL server


  const apolloServer = await createApolloServer();

  apolloServer.applyMiddleware({app, cors: false });
  apolloServer.installSubscriptionHandlers(httpServer);
  // Start the server
  httpServer.listen(3001);
  console.log(`Server is running, GraphQL Playground available at 3001`);
}

bootstrap();
