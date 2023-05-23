import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { CreateUserInput } from "../user/user.input";
import { UserType } from "../user/user.type";
import { AuthDto } from "./auth.dto";
import { AuthService } from "./auth.service";
import { AuthCredentialInput } from "./auth_credential.input";

@Resolver()
export class AuthResolver {
  constructor(
    private authService: AuthService,
  ) {}

  @Mutation(() => AuthDto)
  signUp(
    @Args('signUpInput') signUpInput: CreateUserInput,
  ) {
    return this.authService.signUp(signUpInput);
  }

  @Mutation(() => AuthDto)
  signIn(
    @Args('signInInput') signInInput: AuthCredentialInput,
  ) {
    return this.authService.signIn(signInInput);
  }

}