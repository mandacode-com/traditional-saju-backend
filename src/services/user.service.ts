import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { User } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async createUserIfNotExists(uuid: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: {
        uuid,
      },
    });

    if (user) {
      return user;
    }

    return this.createUser({ uuid });
  }

  async createUser(data: { uuid: string }) {
    return this.prisma.user.create({
      data: {
        uuid: data.uuid,
      },
    });
  }

  async findUser(data: { uuid: string }) {
    return this.prisma.user.findUnique({
      where: {
        uuid: data.uuid,
      },
    });
  }

  async deleteUser(data: { uuid: string }) {
    return this.prisma.user
      .delete({
        where: {
          uuid: data.uuid,
        },
      })
      .catch((err) => {
        if (
          err instanceof PrismaClientKnownRequestError &&
          err.code === 'P2025'
        ) {
          return null;
        }
        throw err;
      });
  }
}
