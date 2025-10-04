import { Module } from '@nestjs/common';
import { UserController } from '../controllers/user.controller';
import { IdpModule } from './idp.module';

@Module({
  imports: [IdpModule],
  controllers: [UserController],
})
export class UserModule {}
