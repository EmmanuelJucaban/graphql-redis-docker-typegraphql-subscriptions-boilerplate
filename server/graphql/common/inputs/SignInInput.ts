import { Field as GqlField, InputType } from 'type-graphql';
import { User } from '../../User/UserSchema';
import { IsEmail, IsString, Length } from 'class-validator';

@InputType()
export class SignInInput implements Partial<User> {
  @GqlField()
  @IsString()
  @IsEmail({}, { message: 'You must provide a valid email address' })
  email!: string;

  @GqlField()
  @IsString()
  @Length(6, 20, { message: 'Password must be at least 6 characters long' })
  password!: string;
}
