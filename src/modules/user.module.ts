import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma.module';
import { UserService } from 'src/services/user.service';
import { UserController } from 'src/controllers/user.controller';
import { EventBusModule } from './event_bus.module';

@Module({
  imports: [PrismaModule, EventBusModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
