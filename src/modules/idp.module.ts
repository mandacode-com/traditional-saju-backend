import { Module } from '@nestjs/common';
import { IdpService } from '../services/idp.service';

@Module({
  providers: [IdpService],
  exports: [IdpService],
})
export class IdpModule {}
