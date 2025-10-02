import { Test } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { TokenModule } from './token.module';
import { validate } from '../config/validate';

describe('TokenModule', () => {
  it('should compile', async () => {
    const module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          validate,
        }),
        TokenModule,
      ],
    }).compile();

    expect(module).toBeDefined();
    await module.close();
  });
});
