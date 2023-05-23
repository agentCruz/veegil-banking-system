import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { MongoRepository } from 'typeorm';
import * as config from 'config';
import { AuthPayloadDto } from './auth_payload.dto';
import { AppStrings } from 'src/config/constants/strings';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private userRepository: MongoRepository<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get(AppStrings.JWT_KEY),
      ignoreExpiration: false,
    });
  }

  async validate(payload: AuthPayloadDto): Promise<User> {
    const { sub } = payload;

    const user = await this.userRepository.findOne({
      where: {
        $or: [{ id: sub }, { email: sub }, { phoneNumber: sub }],
      },
    });

    if (!user) {
      throw new UnauthorizedException(`[${sub}] is not unauthorized`);
    }

    delete user.password;
    delete user.salt;
    delete user._id;

    return user;
  }
}
