import { Controller, Headers, Post, Query } from '@nestjs/common';
import { Public } from '../decorators/public.decorator';
import { AuthService } from 'src/services/auth.service';
import { LoginResponseDto } from './dto/login-response.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @Public()
  async login(
    @Headers('Authorization') bearer: string,
    @Query('provider') provider: string,
  ): Promise<LoginResponseDto> {
    if (!bearer || !bearer.startsWith('Bearer ')) {
      throw new Error('Invalid Authorization header');
    }
    const token = bearer.split(' ')[1];
    if (!token) {
      throw new Error('Token not found in Authorization header');
    }
    if (!provider) {
      throw new Error('Provider query parameter is required');
    }
    const result = await this.authService.login(token, provider);
    return result;
  }
}
