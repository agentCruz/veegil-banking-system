import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserInput } from '../user/user.input';
import { UserService } from '../user/user.service';
import { AuthDto } from './auth.dto';
import { AuthCredentialInput } from './auth_credential.input';

@Injectable()
export class AuthService {
  private logger = new Logger('AuthService');
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn(authCredentialInput: AuthCredentialInput): Promise<AuthDto> {
    const phoneNumber = await this.validateUserPassword(authCredentialInput);

    if (!phoneNumber) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: phoneNumber };
    const accessToken = this.jwtService.sign(payload);

    this.logger.debug(
      `Generated JWT Token with payload ${JSON.stringify(payload)}`,
    );

    return { accessToken };
  }

  async signUp(authCredentialInput: CreateUserInput): Promise<AuthDto> {
    const user = await this.userService.createUser(authCredentialInput);

    // sign in
    const input: AuthCredentialInput = {
      identifier: user.email,
      password: authCredentialInput.password,
    };
    const token = await this.signIn(input);
    return token;
  }

  private async validateUserPassword(
    authCredentialInput: AuthCredentialInput,
  ): Promise<string> {
    const { identifier, password } = authCredentialInput;

    const user = await this.userService.getUserById(identifier);

    if (user && (await user.validatePassword(password))) {
      return user.phoneNumber;
    } else {
      return null;
    }
  }
}
