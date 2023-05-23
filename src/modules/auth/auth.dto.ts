import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class AuthDto {
  @Field()
  accessToken: string;
}
