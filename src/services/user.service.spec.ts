import { Test, TestingModule } from '@nestjs/testing';
import { UserService, CreateUserDto } from './user.service';
import { PrismaService } from './prisma.service';
import { User } from '@prisma/client';
import { NotFoundException } from '@nestjs/common';

describe('UserService', () => {
  let service: UserService;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  const createMockUser = (overrides: Partial<User> = {}): User => ({
    id: 123,
    publicID: 'public-123',
    nickname: 'testuser',
    email: 'test@example.com',
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findByPublicId', () => {
    it('should return user when found', async () => {
      const mockUser = createMockUser();
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.findByPublicId('public-123');

      expect(result).toEqual(mockUser);
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { publicID: 'public-123' },
      });
    });

    it('should return null when user not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      const result = await service.findByPublicId('non-existent');

      expect(result).toBeNull();
    });
  });

  describe('findOrCreate', () => {
    const createUserDto: CreateUserDto = {
      publicID: 'public-123',
      nickname: 'testuser',
      email: 'test@example.com',
    };

    it('should create new user when not exists', async () => {
      const mockUser = createMockUser();
      mockPrismaService.user.findUnique.mockResolvedValue(null);
      mockPrismaService.user.create.mockResolvedValue(mockUser);

      const result = await service.findOrCreate(createUserDto);

      expect(result).toEqual(mockUser);
      expect(mockPrismaService.user.create).toHaveBeenCalledWith({
        data: createUserDto,
      });
    });

    it('should return existing user without update when data unchanged', async () => {
      const mockUser = createMockUser();
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.findOrCreate(createUserDto);

      expect(result).toEqual(mockUser);
      expect(mockPrismaService.user.update).not.toHaveBeenCalled();
      expect(mockPrismaService.user.create).not.toHaveBeenCalled();
    });

    it('should update user when nickname changed', async () => {
      const existingUser = createMockUser();
      const updatedUser = createMockUser({ nickname: 'newNickname' });
      const dtoWithNewNickname: CreateUserDto = {
        ...createUserDto,
        nickname: 'newNickname',
      };

      mockPrismaService.user.findUnique.mockResolvedValue(existingUser);
      mockPrismaService.user.update.mockResolvedValue(updatedUser);

      const result = await service.findOrCreate(dtoWithNewNickname);

      expect(result).toEqual(updatedUser);
      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: { publicID: createUserDto.publicID },
        data: {
          nickname: 'newNickname',
          email: createUserDto.email,
        },
      });
    });

    it('should update user when email changed', async () => {
      const existingUser = createMockUser();
      const updatedUser = createMockUser({ email: 'new@example.com' });
      const dtoWithNewEmail: CreateUserDto = {
        ...createUserDto,
        email: 'new@example.com',
      };

      mockPrismaService.user.findUnique.mockResolvedValue(existingUser);
      mockPrismaService.user.update.mockResolvedValue(updatedUser);

      const result = await service.findOrCreate(dtoWithNewEmail);

      expect(result).toEqual(updatedUser);
      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: { publicID: createUserDto.publicID },
        data: {
          nickname: createUserDto.nickname,
          email: 'new@example.com',
        },
      });
    });

    it('should update user when both nickname and email changed', async () => {
      const existingUser = createMockUser();
      const updatedUser = createMockUser({
        nickname: 'newNickname',
        email: 'new@example.com',
      });
      const dtoWithChanges: CreateUserDto = {
        publicID: createUserDto.publicID,
        nickname: 'newNickname',
        email: 'new@example.com',
      };

      mockPrismaService.user.findUnique.mockResolvedValue(existingUser);
      mockPrismaService.user.update.mockResolvedValue(updatedUser);

      const result = await service.findOrCreate(dtoWithChanges);

      expect(result).toEqual(updatedUser);
      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: { publicID: createUserDto.publicID },
        data: {
          nickname: 'newNickname',
          email: 'new@example.com',
        },
      });
    });
  });

  describe('updateNickname', () => {
    it('should update nickname successfully', async () => {
      const mockUser = createMockUser();
      const updatedUser = createMockUser({ nickname: 'newNickname' });
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      mockPrismaService.user.update.mockResolvedValue(updatedUser);

      const result = await service.updateNickname('public-123', 'newNickname');

      expect(result).toEqual(updatedUser);
      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: { publicID: 'public-123' },
        data: { nickname: 'newNickname' },
      });
    });

    it('should throw NotFoundException when user not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(
        service.updateNickname('non-existent', 'newNickname'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteUser', () => {
    it('should delete user successfully', async () => {
      const mockUser = createMockUser();
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      mockPrismaService.user.delete.mockResolvedValue(mockUser);

      await service.deleteUser('public-123');

      expect(mockPrismaService.user.delete).toHaveBeenCalledWith({
        where: { publicID: 'public-123' },
      });
    });

    it('should throw NotFoundException when user not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.deleteUser('non-existent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
