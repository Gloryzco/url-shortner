import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class RefreshTokenGuard extends AuthGuard('jwt-refresh') {
  handleRequest(err: any, user: any) {
    if (err) {
      console.error('[RefreshTokenGuard] Error:', err.message);
    }
    if (!user) {
      console.error('[RefreshTokenGuard] No user returned from strategy');
      throw new UnauthorizedException('Invalid refresh token');
    }
    console.log('[RefreshTokenGuard] User from refresh token:', user);
    return user;
  }
}
