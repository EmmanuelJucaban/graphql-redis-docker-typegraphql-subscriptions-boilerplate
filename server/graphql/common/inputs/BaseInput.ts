import { IsBoolean, IsString } from "class-validator";
import { Field as GqlField, InputType } from "type-graphql";

@InputType()
export class BaseInput {
  // These should go in the account Schema
  @GqlField()
  @IsString()
  name!: string;

  @GqlField({ nullable: true })
  @IsString()
  exportIdentifier?: string;

  @GqlField()
  @IsString()
  code!: string;

  @GqlField()
  @IsBoolean()
  active!: boolean;
}
