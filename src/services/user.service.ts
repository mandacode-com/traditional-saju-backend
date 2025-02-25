import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { DatingStatus, Gender, JobStatus } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(data: { uuid: string }) {
    return this.prisma.user.create({
      data: {
        uuid: data.uuid,
        UserInfo: {
          create: {},
        },
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
    return this.prisma.user.delete({
      where: {
        uuid: data.uuid,
      },
    });
  }

  async updateUserInfo(
    uuid: string,
    data: {
      name?: string;
      gender?: Gender;
      birthDateTime?: Date;
      age?: number;
      dating?: DatingStatus;
      job?: JobStatus;
    },
  ) {
    return this.prisma.user.update({
      where: {
        uuid,
      },
      data: {
        UserInfo: {
          update: {
            name: data.name,
            gender: data.gender,
            birthdate: data.birthDateTime,
            age: data.age,
            dating: data.dating,
            job: data.job,
          },
        },
      },
    });
  }
}
