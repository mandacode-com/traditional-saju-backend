import { Module } from '@nestjs/common';
import { OpenAIModule } from '../openai.module';
import { DailySajuController } from 'src/controllers/daily_saju.controller';
import { DailySajuService } from 'src/services/saju/daily_saju.service';
import { PrismaModule } from '../prisma.module';

@Module({
  imports: [OpenAIModule, PrismaModule],
  controllers: [DailySajuController],
  providers: [DailySajuService],
})
export class DailySajuModule {}
