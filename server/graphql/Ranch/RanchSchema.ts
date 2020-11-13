import { prop as DbField, Ref } from "@typegoose/typegoose";
import { Field as GqlField, ID, ObjectType } from "type-graphql";
import { BaseSchema,  } from "../common/schema/BaseSchema";
import {  createModel } from "../common/util/createModel";
// import { Field } from '../Field/FieldSchema';


@ObjectType({ description: "Ranch Resource" })
export class Ranch extends BaseSchema {

  // @DbField({ ref: "Field", default: [] })
  // @GqlField(() => [ID], {
  //   nullable: true,
  //   description: "All the Fields that belong to this ranch",
  // })
  // fieldIds?: Ref<Field>[] = [];
}

export const RanchModel = createModel(Ranch);
