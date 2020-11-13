import { ArgsType, Field, ID } from 'type-graphql';

@ArgsType()
export class NewCommentsArgs {
  @Field(type => ID)
  recipeId: string;
}
