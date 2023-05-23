import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import { CreateUserInput, UpdateUserInput } from './user.input';

@Injectable()
export class UserService {
  private logger = new Logger('UserService');
  constructor(
    @InjectRepository(User) private userRepository: MongoRepository<User>,
  ) {}

  async getUserById(identifier: string): Promise<User> {
    const found = await this.userRepository.findOne({
      where: {
        $or: [
          { id: identifier },
          { email: identifier },
          { phoneNumber: identifier },
        ],
      },
    });

    if (!found) {
      throw new NotFoundException(`User with ID: [${identifier}] not found`);
    }

    return found;
  }

  async getUsers(): Promise<User[]> {
    return this.userRepository.find();
  }

  async createUser(createUserInput: CreateUserInput): Promise<User> {
    const { password, ...remaining } = createUserInput;
    const salt = await bcrypt.genSalt();
    const user = this.userRepository.create({
      id: uuid(),
      salt: salt,
      password: await this.hashPassword(password, salt),
      ...remaining,
    });

    try {
      await this.userRepository.save(user);
    } catch (error) {
      this.logger.error(
        `Failed to create user. DTO: ${JSON.stringify(createUserInput)}`,
        error.stack,
      );
      if ((error.code = 'E11000')) {
        throw new ConflictException('User already exists');
      } else {
        throw new InternalServerErrorException(
          `Failed to create user. DTO: ${JSON.stringify(createUserInput)}`,
        );
      }
    }

    delete user.password;
    delete user.salt;

    return user;
  }

  async updateUser(
    id: string,
    updateUserInput: UpdateUserInput,
  ): Promise<User> {
    const { firstName, lastName, gender } = updateUserInput;
    const user = await this.getUserById(id);
    user.firstName = firstName;
    user.lastName = lastName;
    user.gender = gender;

    return this.userRepository.save(user);
  }

  async deleteUser(id: string, user: User): Promise<void> {
    const done = await this.userRepository.delete({
      id,
      phoneNumber: user.phoneNumber,
    });

    if (done.affected === 0) {
      throw new NotFoundException(`User with ID: [${id}] not found`);
    }
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }
}
