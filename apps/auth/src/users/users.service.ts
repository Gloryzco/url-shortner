import {
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersRepository } from './users.repository';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async createUser(request: CreateUserDto): Promise<User> {
    await this.ensureEmailNotTaken(request.email);

    const user = await this.usersRepository.create({
      ...request,
    });

    return user;
  }

  private async ensureEmailNotTaken(email: string): Promise<void> {
    const existingUser = await this.usersRepository.findOne({ email });
    if (existingUser) {
      throw new UnprocessableEntityException('Email already exists.');
    }
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.usersRepository.findOne({ email });

    if (!user) {
      throw new UnauthorizedException('Credentials are not valid.');
    }

    const passwordIsValid = await bcrypt.compare(password, user.password);
    if (!passwordIsValid) {
      throw new UnauthorizedException('Credentials are not valid.');
    }

    return user;
  }

  async getUser(getUserArgs: Partial<User>): Promise<User> {
    const user = await this.usersRepository.findOne(getUserArgs);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
}
