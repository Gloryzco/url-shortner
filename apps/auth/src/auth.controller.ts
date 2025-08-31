import { Controller, HttpStatus, Post, UseGuards, HttpCode } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { User } from './users/schemas/user.schema';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import {
  CurrentUser,
  LocalAuthGuard,
  RefreshTokenGuard,
  ResponseFormat,
} from '@app/common';
import { RefreshResponseDto, UserLoginDto } from './dtos';
import { LoginResponseDto } from './dtos/login-response.dto';
import JwtAuthGuard from '@app/common/auth/src/guards/jwt-auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'User login' })
  @ApiBody({ type: UserLoginDto })
  @ApiOkResponse({
    description: 'User successfully logged in',
    type: LoginResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Invalid request payload' })
  @ApiUnauthorizedResponse({ description: 'Invalid email or password' })
  @ApiInternalServerErrorResponse({ description: 'Unexpected server error' })
  async login(@CurrentUser() user: User) {
    const loginResult = await this.authService.login(user);
    return ResponseFormat.success(
      HttpStatus.OK,
      'Login successful',
      loginResult,
    );
  }

  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiOkResponse({
    description: 'Access token successfully refreshed',
    type: RefreshResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Invalid refresh token request' })
  @ApiUnauthorizedResponse({ description: 'Invalid or expired refresh token' })
  @ApiInternalServerErrorResponse({ description: 'Unexpected server error' })
  async refresh(@CurrentUser() user: User) {
    const tokens = await this.authService.refresh(user);
    return ResponseFormat.success(
      HttpStatus.OK,
      'Token refreshed successfully',
      tokens,
    );
  }

  @UseGuards(JwtAuthGuard)
  @MessagePattern('validate_user')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Validate JWT and return user' })
  @ApiOkResponse({
    description: 'User validated successfully',
    type: User,
  })
  @ApiBadRequestResponse({ description: 'Invalid validation request' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid JWT' })
  @ApiForbiddenResponse({ description: 'User does not have permission' })
  @ApiInternalServerErrorResponse({ description: 'Unexpected server error' })
  validateUser(@CurrentUser() user: User) {
    return user;
  }
}
