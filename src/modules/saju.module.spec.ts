import { Test } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { SajuModule } from './saju.module';
import { validate } from '../config/validate';

describe('SajuModule', () => {
  it('should compile', async () => {
    const module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          validate,
        }),
        SajuModule,
      ],
    }).compile();

    expect(module).toBeDefined();
    await module.close();
  });
});
