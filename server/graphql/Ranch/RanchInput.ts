import { Field as GqlField, ID, InputType } from "type-graphql";
import { IsString, MinLength, ValidateIf } from "class-validator";

import { BaseInput,  } from "../common/inputs/BaseInput";
import { BaseQueryInput } from "../common/inputs/BaseQueryInput";

@InputType()
export class FetchRanchInput extends BaseQueryInput {}

@InputType()
export class CreateRanchInput extends BaseInput {
}

@InputType()
export class DeleteRanchInput extends BaseQueryInput {}

@InputType()
export class UpdateRanchInput extends CreateRanchInput {
  @GqlField()
  @IsString()
  id!: string;
}
