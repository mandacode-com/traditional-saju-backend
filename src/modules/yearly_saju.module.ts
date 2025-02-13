import { Module } from '@nestjs/common';
import { OpenAIModule } from './openai.module';
import { YearlySajuService } from 'src/services/yearly_saju.service';
import { YearlySajuController } from 'src/controllers/yearly_saju.controller';

@Module({
  imports: [OpenAIModule],
  controllers: [YearlySajuController],
  providers: [YearlySajuService],
})
export class YearlySajuModule {}
