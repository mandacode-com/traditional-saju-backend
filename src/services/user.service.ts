import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { User } from '@prisma/client';

export interface CreateUserDto {
  publicID: string;
}

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async findByPublicId(publicID: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { publicID },
    });
  }

  async findOrCreate(data: CreateUserDto): Promise<User> {
    const existing = await this.findByPublicId(data.publicID);

    if (existing) {
      return existing;
    }

    return this.prisma.user.create({
      data: {
        publicID: data.publicID,
      },
    });
  }

  async deleteUser(publicID: string): Promise<void> {
    const user = await this.findByPublicId(publicID);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.prisma.user.delete({
      where: { publicID },
    });
  }
}
