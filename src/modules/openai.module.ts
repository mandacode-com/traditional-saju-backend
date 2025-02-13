import { Module } from '@nestjs/common';
import { OpenAIService } from 'src/services/openai.service';

@Module({
  providers: [OpenAIService],
  exports: [OpenAIService],
})
export class OpenAIModule {}
