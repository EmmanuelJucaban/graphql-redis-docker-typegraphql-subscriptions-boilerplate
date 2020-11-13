import { ReturnModelType } from '@typegoose/typegoose';
import { Request, Response } from 'express';
import { PubSub } from 'apollo-server-express';
import { Ranch } from '../../Ranch/RanchSchema';


export interface Database {
  Ranch: ReturnModelType<typeof Ranch> & Ranch;
}

export interface Context {
  db: Database;
  req: Request;
  res: Response;
  pubsub: PubSub;
}
