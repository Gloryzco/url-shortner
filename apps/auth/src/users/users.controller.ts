import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import {
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiConflictResponse,
  ApiInternalServerErrorResponse,
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
  @ApiBody({ type: CreateUserDto })
  @ApiCreatedResponse({
    type: UserResponseDto,
    description: 'User has been created successfully',
  })
  @ApiBadRequestResponse({ description: 'Invalid request payload' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized request' })
  @ApiConflictResponse({ description: 'Email already exists' })
  @ApiInternalServerErrorResponse({ description: 'Unexpected server error' })
  async createUser(@Body() request: CreateUserDto): Promise<any> {
    const user = await this.usersService.createUser(request);

    return ResponseFormat.success(
      HttpStatus.CREATED,
      'User has been created successfully',
      user,
    );
  }
}
