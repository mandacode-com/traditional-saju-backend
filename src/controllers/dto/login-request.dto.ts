import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsIn } from 'class-validator';

export class LoginRequestDto {
  @ApiProperty({
    example: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'ID token from OAuth2 provider',
  })
  @IsString()
  @IsNotEmpty()
  id_token: string;

  @ApiProperty({
    example: 'google',
    description: 'IDP provider name',
    enum: ['google', 'kakao', 'naver'],
  })
  @IsString()
  @IsIn(['google', 'kakao', 'naver'])
  provider: string;
}
