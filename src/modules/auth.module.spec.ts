import { Test } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth.module';
import { validate } from '../config/validate';

describe('AuthModule', () => {
  it('should compile', async () => {
    const module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          validate,
        }),
        AuthModule,
      ],
    }).compile();

    expect(module).toBeDefined();
    await module.close();
  });
});
