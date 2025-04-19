import { Module } from '@nestjs/common';
import { YearlySajuService } from 'src/services/saju/yearly_saju.service';
import { OpenAIModule } from './openai.module';
import { PrismaModule } from './prisma.module';
import { SajuController } from 'src/controllers/saju.controller';
import { DailySajuService } from 'src/services/saju/daily_saju.service';

@Module({
  imports: [OpenAIModule, PrismaModule],
  controllers: [SajuController],
  providers: [YearlySajuService, DailySajuService],
})
export class SajuModule {}
