import { Module } from '@nestjs/common';
import { OpenAIModule } from './openai.module';
import { PrismaModule } from './prisma.module';
import { SajuController } from '../controllers/saju.controller';
import { YearlySajuService } from '../services/yearly-saju.service';
import { DailySajuService } from '../services/daily-saju.service';
import { ScoreService } from '../services/score.service';

@Module({
  imports: [OpenAIModule, PrismaModule],
  controllers: [SajuController],
  providers: [YearlySajuService, DailySajuService, ScoreService],
})
export class SajuModule {}
