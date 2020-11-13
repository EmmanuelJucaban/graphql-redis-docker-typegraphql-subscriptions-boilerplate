import { Field as GqlField, InputType } from 'type-graphql';
import { IsString, } from 'class-validator';

@InputType()
export class BaseQueryInput {
  // These should go in the account Schema
  @GqlField()
  @IsString()
  id!: string;
}
