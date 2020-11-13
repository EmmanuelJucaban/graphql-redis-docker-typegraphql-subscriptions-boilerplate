import { prop as DbField } from '@typegoose/typegoose/lib/prop';
import { Field as GqlField, ID, ObjectType,  } from 'type-graphql';
import { ObjectId } from 'mongodb';





@ObjectType({ description: 'Common Fields for All Resources' })
export class BaseSchema {
  /** Both in Schema and GraphQL */
  @GqlField(() => ID!, { name: 'id' })
  _id: ObjectId;

  @DbField({
    required: true,
    index: true,
    trim: true,
  })
  @GqlField(() => String,)
  name!: string;

  @DbField({
    required: true,
  })
  @GqlField(() => Boolean, { nullable: true })
  active?: boolean;

  @DbField()
  @GqlField(() => String, { nullable: true })
  code?: string;

  @DbField()
  @GqlField(() => String, { nullable: true })
  exportIdentifier?: string;

  @GqlField(() => Date, { nullable: true })
  updatedAt?: Date;

  @GqlField(() => Date, { nullable: true })
  createdAt?: Date;
}
