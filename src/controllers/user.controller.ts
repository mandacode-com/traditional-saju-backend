import { Controller, Delete, Get, Post } from '@nestjs/common';
import { Roles } from 'src/decorators/role.decorator';
import { User } from 'src/decorators/user.decorator';
import { RoleEnum } from 'src/schemas/role.schema';
import { UserService } from 'src/services/user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @Roles([RoleEnum.ADMIN, RoleEnum.USER])
  async createUser(@User('uuid') uuid: string) {
    return this.userService.createUser({ uuid });
  }

  @Get()
  @Roles([RoleEnum.ADMIN, RoleEnum.USER])
  async findUser(@User('uuid') uuid: string) {
    return this.userService.findUser({ uuid });
  }

  @Delete()
  @Roles([RoleEnum.ADMIN, RoleEnum.USER])
  async deleteUser(@User('uuid') uuid: string) {
    return this.userService.deleteUser({ uuid });
  }
}
