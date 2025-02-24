import { Module } from '@nestjs/common';
import { OpenAIModule } from './openai.module';
import { DailySajuController } from 'src/controllers/daily_saju.controller';
import { DailySajuService } from 'src/services/daily_saju.service';

@Module({
  imports: [OpenAIModule],
  controllers: [DailySajuController],
  providers: [DailySajuService],
})
export class DailySajuModule {}
