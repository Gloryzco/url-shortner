/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { User } from './users/schemas/user.schema';
import { Types } from 'mongoose';

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: jest.Mocked<JwtService>;
  let configService: jest.Mocked<ConfigService>;

  const mockUser: User = {
    _id: new Types.ObjectId(),
    email: 'test@example.com',
    createdAt: new Date(),
  } as unknown as User;

  beforeEach(async () => {
    jwtService = {
      signAsync: jest.fn(),
    } as any;

    configService = {
      get: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: JwtService, useValue: jwtService },
        { provide: ConfigService, useValue: configService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  describe('msToMillis', () => {
    it('should convert seconds string to milliseconds', () => {
      expect(service.msToMillis('30s')).toBe(30000);
    });

    it('should convert minutes string to milliseconds', () => {
      expect(service.msToMillis('2m')).toBe(120000);
    });

    it('should convert hours string to milliseconds', () => {
      expect(service.msToMillis('1h')).toBe(3600000);
    });

    it('should convert days string to milliseconds', () => {
      expect(service.msToMillis('1d')).toBe(86400000);
    });

    it('should fallback to seconds if unit unknown', () => {
      expect(service.msToMillis('10x')).toBe(10000);
    });
  });

  describe('getTokens', () => {
    it('should generate access and refresh tokens', async () => {
      configService.get.mockImplementation((key: string) => {
        switch (key) {
          case 'JWT_EXPIRATION':
            return '30s';
          case 'JWT_REFRESH_EXPIRATION':
            return '60s';
          case 'JWT_SECRET':
            return 'access-secret';
          case 'JWT_REFRESH_SECRET':
            return 'refresh-secret';
          default:
            return null;
        }
      });

      jwtService.signAsync.mockResolvedValueOnce('mockAccessToken');
      jwtService.signAsync.mockResolvedValueOnce('mockRefreshToken');

      const result = await service.getTokens(mockUser);

      expect(result.accessToken).toBe('mockAccessToken');
      expect(result.refreshToken).toBe('mockRefreshToken');
      expect(result.accessTokenExpiresAt).toBeInstanceOf(Date);
      expect(result.refreshTokenExpiresAt).toBeInstanceOf(Date);
      expect(jwtService.signAsync).toHaveBeenCalledTimes(2);
    });
  });

  describe('login', () => {
    it('should return tokens and user dto', async () => {
      jest.spyOn(service, 'getTokens').mockResolvedValueOnce({
        accessToken: 'mockAccessToken',
        refreshToken: 'mockRefreshToken',
        accessTokenExpiresAt: new Date(),
        refreshTokenExpiresAt: new Date(),
      });

      const result = await service.login(mockUser);

      expect(result.accessToken).toBe('mockAccessToken');
      expect(result.refreshToken).toBe('mockRefreshToken');
      expect(result.user).toMatchObject({
        id: mockUser._id.toHexString(),
        email: mockUser.email,
      });
    });
  });

  describe('refresh', () => {
    it('should return new access token', async () => {
      jest.spyOn(service, 'getTokens').mockResolvedValueOnce({
        accessToken: 'newAccessToken',
        refreshToken: 'refreshToken',
        accessTokenExpiresAt: new Date(),
        refreshTokenExpiresAt: new Date(),
      });

      const result = await service.refresh(mockUser);

      expect(result).toEqual({ accessToken: 'newAccessToken' });
    });
  });
});
