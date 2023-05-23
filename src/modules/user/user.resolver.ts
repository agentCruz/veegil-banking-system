import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AppAuthGuard } from '../auth/auth.guard';
import { GetUser } from '../auth/user_decorator';
import { User } from './user.entity';
import { CreateUserInput, UpdateUserInput } from './user.input';
import { UserService } from './user.service';
import { UserType } from './user.type';

@Resolver(() => UserType)
export class UserResolver {
  constructor(private userService: UserService) {}

  @Query(() => UserType)
  user(@Args('id') id: string): any {
    return this.userService.getUserById(id);
  }

  @Query(() => [UserType])
  @UseGuards(AppAuthGuard)
  users(@GetUser() user: User) {
    return this.userService.getUsers();
  }

  @Mutation(() => UserType)
  createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    return this.userService.createUser(createUserInput);
  }

  @Mutation(() => UserType)
  updateUser(
    @Args('id') id: string,
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
  ) {
    return this.userService.updateUser(id, updateUserInput);
  }
}
