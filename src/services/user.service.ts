import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { User } from '@prisma/client';

export interface CreateUserDto {
  publicID: string;
  nickname: string;
  email: string;
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
      // Update nickname and email if changed
      if (existing.nickname !== data.nickname || existing.email !== data.email) {
        return this.prisma.user.update({
          where: { publicID: data.publicID },
          data: {
            nickname: data.nickname,
            email: data.email,
          },
        });
      }
      return existing;
    }

    return this.prisma.user.create({
      data: {
        publicID: data.publicID,
        nickname: data.nickname,
        email: data.email,
      },
    });
  }
}
