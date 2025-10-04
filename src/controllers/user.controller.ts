import {
  Controller,
  Delete,
  HttpCode,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { User } from '../decorators/user.decorator';
import { IdpService } from '../services/idp.service';

@ApiTags('user')
@ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor(private readonly idpService: IdpService) {}

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

    // Delete from IDP (user service manages user data)
    await this.idpService.deleteUser(userId);
  }
}
