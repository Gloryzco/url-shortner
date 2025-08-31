import { Controller, HttpStatus, Post, Res, UseGuards } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { CurrentUser } from './current-user.decorator';
import JwtAuthGuard from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { User } from './users/schemas/user.schema';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ResponseFormat } from '@app/common';
import { UserLoginDto } from './dtos';
import { LoginResponseDto } from './dtos/login-response.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiBody({ type: UserLoginDto })
  @ApiOkResponse({
    description: 'User successfully logged in',
    type: LoginResponseDto,
  })
  @ApiOperation({ summary: 'User login' })
  @ApiOkResponse({ description: 'User successfully logged in', type: User })
  async login(
    @CurrentUser() user: User,
    @Res({ passthrough: true }) res: Response,
  ) {
    const loginResult = await this.authService.login(user, res);

    return ResponseFormat.success(
      HttpStatus.OK,
      'Login successful',
      loginResult,
    );
  }

  @UseGuards(JwtAuthGuard)
  @MessagePattern('validate_user')
  @ApiOperation({ summary: 'Validate JWT and return user' })
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'User validated successfully', type: User })
  validateUser(@CurrentUser() user: User) {
    return user;
  }
}
