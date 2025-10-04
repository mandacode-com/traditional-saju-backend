import { Module } from '@nestjs/common';
import { AuthController } from '../controllers/auth.controller';
import { AuthService } from '../services/auth.service';
import { IdpModule } from './idp.module';
import { TokenModule } from './token.module';

@Module({
  imports: [IdpModule, TokenModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthApiModule {}
