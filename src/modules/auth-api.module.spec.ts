import { Test } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { AuthApiModule } from './auth-api.module';
import { validate } from '../config/validate';

describe('AuthApiModule', () => {
  it('should compile', async () => {
    const module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          validate,
        }),
        AuthApiModule,
      ],
    }).compile();

    expect(module).toBeDefined();
    await module.close();
  });
});
