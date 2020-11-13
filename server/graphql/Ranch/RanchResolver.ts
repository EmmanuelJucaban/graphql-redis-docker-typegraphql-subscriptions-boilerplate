import { ObjectId } from 'mongodb';
import { Document } from "mongoose";
import {
  Arg,
  Authorized,
  Ctx,
  FieldResolver,
  Mutation, PubSub,
  Query,
  Resolver,
  Root,
  Subscription,
  UseMiddleware,
} from "type-graphql";
import { Context } from '../common/types/BaseTypes';
import { validateInput } from '../common/util/validateInputs';




import { Ranch } from "./RanchSchema";
import { CreateRanchInput, DeleteRanchInput, FetchRanchInput, UpdateRanchInput, } from "./RanchInput";



@Resolver(() => Ranch)
export class RanchResolver  {
  @Query(() => [ Ranch ])
  async fetchRanches(@Ctx() { db, }: Context): Promise<Ranch[] | null> {
    try {
      return await db.Ranch.find();
    } catch (e) {
      console.log("Error L:33 RanchResolver fetching ranches", e);
      throw new Error(e);
    }
  }


  @Query(() => Ranch)
  async fetchRanch(
    @Arg("fetchRanchInput") fetchRanchInput: FetchRanchInput,
    @Ctx() { db, }: Context
  ): Promise<Ranch | null> {
    try {
      return await db.Ranch.findById(fetchRanchInput.id);
    } catch (e) {
      console.log("Error L:65 RanchResolver fetching ranch", e);
      throw new Error(e);
    }
  }

  @Mutation(() => Ranch)
  // @UseMiddleware(AuthenticateUser)
  // @Authorized('Admin', 'Manager', 'SetupUser')
  async createRanch(
    @Arg("createRanchInput") createRanchInput: CreateRanchInput,
    @Ctx() { db, }: Context,
    @PubSub('RANCH') notifyRanch,
  ): Promise<Ranch | null> {

    const newRanch =  await db.Ranch.create({
      ...createRanchInput
    });
    await notifyRanch(newRanch);
    return newRanch;
  }

  @Subscription(returns => Ranch, {
    topics: 'RANCH'
  })
  newRanch(
    @Root() newRanch,
  ) {
    console.log(newRanch)
    return newRanch
  }





}

