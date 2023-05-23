import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty, IsString, MinLength, MaxLength, Matches } from "class-validator";

@InputType()
export class AuthCredentialInput {
    @IsNotEmpty()
    @IsString()
    @Field()
    identifier: string;
  
    @IsNotEmpty()
    @MinLength(8)
    @MaxLength(20)
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, { message: 'Password too weak' })
    @Field()
    password: string;
  }
  