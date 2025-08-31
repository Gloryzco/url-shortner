import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import {
  ApiCreatedResponse,
  ApiBody,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ResponseFormat } from '@app/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserResponseDto } from './dto/use-created-response.dto';

@ApiTags('Users')
@Controller('auth/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Register a new user' })
  @ApiCreatedResponse({
    type: UserResponseDto,
    description: 'User has been created successfully',
  })
  @ApiBody({ type: CreateUserDto })
  async createUser(@Body() request: CreateUserDto): Promise<any> {
    const user = await this.usersService.createUser(request);

    return ResponseFormat.success(
      HttpStatus.CREATED,
      'User has been created successfully',
      user,
    );
  }
}
