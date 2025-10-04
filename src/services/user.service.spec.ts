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

    it('should return existing user when already exists', async () => {
      const mockUser = createMockUser();
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.findOrCreate(createUserDto);

      expect(result).toEqual(mockUser);
      expect(mockPrismaService.user.update).not.toHaveBeenCalled();
      expect(mockPrismaService.user.create).not.toHaveBeenCalled();
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
