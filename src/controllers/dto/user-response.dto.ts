import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({ description: 'User public ID' })
  publicID: string;

  @ApiProperty({ description: 'User nickname' })
  nickname: string;

  @ApiProperty({ description: 'User email' })
  email: string;
}
