import { ApiProperty } from '@nestjs/swagger';

export class UpdateNicknameDto {
  @ApiProperty({ example: 'newNickname', description: 'New nickname' })
  nickname: string;
}
