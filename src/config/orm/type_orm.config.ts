import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from 'src/modules/user/user.entity';
import * as config from 'config';
import { AppStrings } from '../constants/strings';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'mongodb',
  url: config.get(AppStrings.DB),
  synchronize: config.get(AppStrings.DB_SYNC),
  useUnifiedTopology: config.get(AppStrings.DB_TP),
  entities: [User],
};
