import { Test } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { IdpModule } from './idp.module';
import { validate } from '../config/validate';

describe('IdpModule', () => {
  it('should compile', async () => {
    const module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          validate,
        }),
        IdpModule,
      ],
    }).compile();

    expect(module).toBeDefined();
    await module.close();
  });
});
