import { Test } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user.module';
import { validate } from '../config/validate';

describe('UserModule', () => {
  it('should compile', async () => {
    const module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          validate,
        }),
        UserModule,
      ],
    }).compile();

    expect(module).toBeDefined();
    await module.close();
  });
});
