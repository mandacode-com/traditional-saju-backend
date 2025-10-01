import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { TokenService } from './token.service';

describe('TokenService', () => {
  let service: TokenService;

  const mockConfigService = {
    get: jest.fn().mockReturnValue({
      accessTokenSecret: 'test-access-secret',
      refreshTokenSecret: 'test-refresh-secret',
      accessTokenExpiresIn: 900,
      refreshTokenExpiresIn: 604800,
    }),
  };

  const mockJwtService = {
    signAsync: jest.fn(),
    verifyAsync: jest.fn(),
  };

  const mockRedis = {
    set: jest.fn(),
    get: jest.fn(),
    del: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TokenService,
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: Redis,
          useValue: mockRedis,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<TokenService>(TokenService);

    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('issueToken', () => {
    it('should issue access and refresh tokens', async () => {
      const userID = 'user-123';
      const userName = 'testuser';
      const mockAccessToken = 'mock-access-token';
      const mockRefreshToken = 'mock-refresh-token';

      mockJwtService.signAsync
        .mockResolvedValueOnce(mockAccessToken)
        .mockResolvedValueOnce(mockRefreshToken);
      mockRedis.set.mockResolvedValue('OK');

      const result = await service.issueToken(userID, userName);

      expect(result).toEqual({
        accessToken: mockAccessToken,
        refreshToken: mockRefreshToken,
      });

      expect(mockJwtService.signAsync).toHaveBeenCalledTimes(2);
      expect(mockJwtService.signAsync).toHaveBeenNthCalledWith(
        1,
        { userID, userName },
        {
          secret: 'test-access-secret',
          expiresIn: 900,
        },
      );
      expect(mockJwtService.signAsync).toHaveBeenNthCalledWith(
        2,
        { userID },
        {
          secret: 'test-refresh-secret',
          expiresIn: 604800,
        },
      );

      expect(mockRedis.set).toHaveBeenCalledWith(
        `refreshToken:${userID}`,
        mockRefreshToken,
        'EX',
        604800,
      );
    });
  });

  describe('verifyAccessToken', () => {
    it('should verify and return access token payload', async () => {
      const token = 'valid-access-token';
      const mockPayload = { userID: 'user-123', userName: 'testuser' };

      mockJwtService.verifyAsync.mockResolvedValue(mockPayload);

      const result = await service.verifyAccessToken(token);

      expect(result).toEqual(mockPayload);
      expect(mockJwtService.verifyAsync).toHaveBeenCalledWith(token, {
        secret: 'test-access-secret',
      });
    });

    it('should throw error for invalid access token', async () => {
      const token = 'invalid-token';
      mockJwtService.verifyAsync.mockRejectedValue(new Error('Invalid token'));

      await expect(service.verifyAccessToken(token)).rejects.toThrow(
        'Invalid token',
      );
    });
  });

  describe('verifyRefreshToken', () => {
    it('should verify refresh token and check Redis storage', async () => {
      const token = 'valid-refresh-token';
      const mockPayload = { userID: 'user-123' };

      mockJwtService.verifyAsync.mockResolvedValue(mockPayload);
      mockRedis.get.mockResolvedValue(token);

      const result = await service.verifyRefreshToken(token);

      expect(result).toEqual(mockPayload);
      expect(mockJwtService.verifyAsync).toHaveBeenCalledWith(token, {
        secret: 'test-refresh-secret',
      });
      expect(mockRedis.get).toHaveBeenCalledWith(
        `refreshToken:${mockPayload.userID}`,
      );
    });

    it('should throw error if token not found in Redis', async () => {
      const token = 'valid-but-revoked-token';
      const mockPayload = { userID: 'user-123' };

      mockJwtService.verifyAsync.mockResolvedValue(mockPayload);
      mockRedis.get.mockResolvedValue(null);

      await expect(service.verifyRefreshToken(token)).rejects.toThrow(
        'Invalid refresh token',
      );
    });

    it('should throw error if stored token does not match', async () => {
      const token = 'token-1';
      const storedToken = 'token-2';
      const mockPayload = { userID: 'user-123' };

      mockJwtService.verifyAsync.mockResolvedValue(mockPayload);
      mockRedis.get.mockResolvedValue(storedToken);

      await expect(service.verifyRefreshToken(token)).rejects.toThrow(
        'Invalid refresh token',
      );
    });
  });

  describe('revokeRefreshToken', () => {
    it('should delete refresh token from Redis', async () => {
      const userID = 'user-123';
      mockRedis.del.mockResolvedValue(1);

      await service.revokeRefreshToken(userID);

      expect(mockRedis.del).toHaveBeenCalledWith(`refreshToken:${userID}`);
    });
  });
});
