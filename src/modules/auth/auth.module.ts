import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { UserModule } from '../user/user.module';
import { AppAuthGuard } from './auth.guard';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt_strategy';
import * as config from 'config';
import { AppStrings } from 'src/config/constants/strings';

@Module({
  imports: [
    PassportModule.register({
      defaultStrategy: AppStrings.JWT_STRATEGY,
    }),
    JwtModule.register({
      secret: config.get(AppStrings.JWT_KEY),
      signOptions: {
        expiresIn: AppStrings.JWT_EXPIRY,
      },
    }),
    TypeOrmModule.forFeature([User]),
    UserModule,
  ],
  providers: [AuthResolver, AuthService, JwtStrategy, AppAuthGuard],
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}
