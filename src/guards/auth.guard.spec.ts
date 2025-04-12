import { AuthGuard } from './auth.guard';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { RoleEnum } from 'src/schemas/role.schema';
import { Config } from 'src/schemas/config.schema';
import { JwtService } from '@nestjs/jwt';
import { TokenPayload } from 'src/schemas/token.schema';
import { PrismaService } from 'src/services/prisma.service';

class TestAuthGuard extends AuthGuard {}

// Mocks
const mockReflector = {
  get: jest.fn(),
} as unknown as Reflector;

const mockConfigService = {
  get: jest.fn().mockReturnValue({
    gatewayJwtHeader: 'x-gateway-jwt',
    gatewayJwtSecret: 'secret',
  } as Config['auth']),
} as unknown as ConfigService<Config, true>;

const mockJwtService = {
  verifyAsync: jest.fn(() => Promise.resolve()),
} as unknown as JwtService;
const mockPrismaService = {
  user: {
    findUnique: jest.fn(),
  },
} as unknown as PrismaService;

const createMockExecutionContext = (headers: Record<string, string>) => {
  return {
    switchToHttp: () => ({
      getRequest: () => ({
        headers,
      }),
    }),
    getHandler: () => ({}),
  } as unknown as ExecutionContext;
};

// Tests
describe('AuthGuard', () => {
  let guard: TestAuthGuard;

  beforeEach(() => {
    jest.clearAllMocks();
    guard = new TestAuthGuard(
      mockJwtService,
      mockConfigService,
      mockReflector,
      mockPrismaService,
    );
  });

  describe('canActivate', () => {
    it('should allow public route (no roles)', async () => {
      mockReflector.get = jest.fn().mockReturnValue(undefined);
      const context = createMockExecutionContext({});
      await expect(guard.canActivate(context)).resolves.toBe(true);
    });

    it('should allow route if GUEST role is present', async () => {
      mockReflector.get = jest.fn().mockReturnValue([RoleEnum.GUEST]);
      const context = createMockExecutionContext({});
      await expect(guard.canActivate(context)).resolves.toBe(true);
    });

    it('should throw UnauthorizedException if no token is provided', async () => {
      mockReflector.get = jest.fn().mockReturnValue([RoleEnum.USER]);
      const context = createMockExecutionContext({});
      await expect(guard.canActivate(context)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException if token is invalid', async () => {
      mockReflector.get = jest.fn().mockReturnValue([RoleEnum.USER]);
      const context = createMockExecutionContext({
        'x-gateway-jwt': 'invalid-token',
      });
      mockJwtService.verifyAsync = jest.fn().mockRejectedValue(new Error());
      await expect(guard.canActivate(context)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException if token payload is invalid', async () => {
      mockReflector.get = jest.fn().mockReturnValue([RoleEnum.USER]);
      const context = createMockExecutionContext({
        'x-gateway-jwt': 'valid-token',
      });
      mockJwtService.verifyAsync = jest.fn().mockResolvedValue({
        uuid: 'uuid',
        role: 'invalid-role' as RoleEnum,
      } as TokenPayload);
      await expect(guard.canActivate(context)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should return false if role is invalid', async () => {
      mockReflector.get = jest.fn().mockReturnValue([RoleEnum.ADMIN]);
      const context = createMockExecutionContext({
        'x-gateway-jwt': 'valid-token',
      });
      mockJwtService.verifyAsync = jest.fn().mockResolvedValue({
        uuid: 'uuid',
        role: RoleEnum.USER,
      } as TokenPayload);
      await expect(guard.canActivate(context)).resolves.toBe(false);
    });

    it('should allow route if role is valid', async () => {
      mockReflector.get = jest.fn().mockReturnValue([RoleEnum.USER]);
      const context = createMockExecutionContext({
        'x-gateway-jwt': 'valid-token',
      });
      mockJwtService.verifyAsync = jest.fn().mockResolvedValue({
        uuid: 'uuid',
        role: RoleEnum.USER,
      } as TokenPayload);
      mockPrismaService.user.findUnique = jest.fn().mockResolvedValue({
        uuid: 'uuid',
        role: RoleEnum.USER,
      });
      await expect(guard.canActivate(context)).resolves.toBe(true);
    });
  });
});
