import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from '../services/user.service';
import { IdpService } from '../services/idp.service';

describe('UserController', () => {
  let controller: UserController;

  const mockUserService = {
    deleteUser: jest.fn(),
  };

  const mockIdpService = {
    deleteUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: IdpService,
          useValue: mockIdpService,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('deleteUser', () => {
    it('should delete user successfully', async () => {
      mockIdpService.deleteUser.mockResolvedValue(undefined);
      mockUserService.deleteUser.mockResolvedValue(undefined);

      await controller.deleteUser('user-123');

      expect(mockIdpService.deleteUser).toHaveBeenCalledWith('user-123');
      expect(mockUserService.deleteUser).toHaveBeenCalledWith('user-123');
    });

    it('should throw UnauthorizedException when userId is missing', async () => {
      await expect(controller.deleteUser(undefined)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should call IDP delete before local delete', async () => {
      const callOrder: string[] = [];
      mockIdpService.deleteUser.mockImplementation(() => {
        callOrder.push('idp');
        return Promise.resolve();
      });
      mockUserService.deleteUser.mockImplementation(() => {
        callOrder.push('local');
        return Promise.resolve();
      });

      await controller.deleteUser('user-123');

      expect(callOrder).toEqual(['idp', 'local']);
    });
  });
});
