import { Module } from '@nestjs/common';
import { OpenAIModule } from '../openai.module';
import { YearlySajuService } from 'src/services/saju/yearly_saju.service';
import { YearlySajuController } from 'src/controllers/yearly_saju.controller';
import { PrismaModule } from '../prisma.module';

@Module({
  imports: [OpenAIModule, PrismaModule],
  controllers: [YearlySajuController],
  providers: [YearlySajuService],
})
export class YearlySajuModule {}
