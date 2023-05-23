import { Field, ID, ObjectType } from '@nestjs/graphql';
import { UserGenderDto } from './user.gender.enum';

@ObjectType('User')
export class UserType {
  @Field(() => ID)
  id: string;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  phoneNumber: string;

  @Field()
  email: string;

  @Field()
  gender: UserGenderDto;

  @Field()
  createdAt: string;

  @Field()
  updatedAt: string;

//   @Field(type => [StudentType])
//   transactions: string[];
}
