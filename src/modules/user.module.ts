import { Module } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { PrismaModule } from './prisma.module';
import { UserController } from '../controllers/user.controller';
import { IdpModule } from './idp.module';

@Module({
  imports: [PrismaModule, IdpModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
