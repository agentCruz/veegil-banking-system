import { Field, InputType } from '@nestjs/graphql';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { UserGenderDto } from './user.gender.enum';

@InputType()
export class CreateUserInput {
  @MinLength(11)
  @MaxLength(13)
  @Field()
  phoneNumber: string;

  @Field()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @Field()
  firstName: string;

  @IsString()
  @Field()
  lastName: string;

  @IsNotEmpty()
  @Field()
  gender: UserGenderDto;

  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(20)
  @Field()
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password too weak',
  })
  password: string;
}

@InputType()
export class UpdateUserInput {
  @IsString()
  @Field()
  firstName: string;

  @IsString()
  @Field()
  lastName: string;

  @IsNotEmpty()
  @Field()
  gender: UserGenderDto;
}
