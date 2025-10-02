import { Module } from '@nestjs/common';
import { OpenAIModule } from './openai.module';
import { PrismaModule } from './prisma.module';
import { SajuController } from 'src/controllers/saju.controller';
import { YearlySajuService } from 'src/services/yearly-saju.service';
import { DailySajuService } from 'src/services/daily-saju.service';
import { ScoreService } from 'src/services/score.service';

@Module({
  imports: [OpenAIModule, PrismaModule],
  controllers: [SajuController],
  providers: [YearlySajuService, DailySajuService, ScoreService],
})
export class SajuModule {}
