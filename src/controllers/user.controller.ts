import {
  Body,
  Controller,
  Delete,
  HttpCode,
  Patch,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { User } from '../decorators/user.decorator';
import { UserService } from '../services/user.service';
import { IdpService } from '../services/idp.service';
import { UpdateNicknameDto } from './dto/update-nickname.dto';
import { UserResponseDto } from './dto/user-response.dto';

@ApiTags('user')
@ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly idpService: IdpService,
  ) {}

  @Patch('nickname')
  @HttpCode(200)
  @ApiOperation({ summary: 'Update user nickname' })
  @ApiBody({ type: UpdateNicknameDto })
  @ApiResponse({
    status: 200,
    description: 'Nickname updated successfully',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async updateNickname(
    @Body() body: UpdateNicknameDto,
    @User('userId') userId?: string,
  ): Promise<UserResponseDto> {
    if (!userId) {
      throw new UnauthorizedException('User not authenticated');
    }

    const user = await this.userService.updateNickname(userId, body.nickname);

    return {
      publicID: user.publicID,
      nickname: user.nickname,
      email: user.email,
    };
  }

  @Delete()
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete user account' })
  @ApiResponse({ status: 204, description: 'User deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async deleteUser(@User('userId') userId?: string): Promise<void> {
    if (!userId) {
      throw new UnauthorizedException('User not authenticated');
    }

    // Delete from IDP first
    await this.idpService.deleteUser(userId);

    // Then delete from local database
    await this.userService.deleteUser(userId);
  }
}
