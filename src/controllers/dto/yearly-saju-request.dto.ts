import { ApiProperty } from '@nestjs/swagger';

export class YearlySajuRequestDto {
  @ApiProperty({ example: '2000-01-01', description: 'Birth date' })
  birthDate: string;

  @ApiProperty({ example: '12:00', description: 'Birth time' })
  birthTime: string;

  @ApiProperty({ enum: ['male', 'female'], description: 'Gender' })
  gender: 'male' | 'female';

  @ApiProperty({ required: false, description: 'Is leap month' })
  isLeapMonth?: boolean;

  @ApiProperty({ required: false, description: 'Birth time unknown' })
  isBirthTimeUnknown?: boolean;

  @ApiProperty({ required: false, description: 'Optional question' })
  question?: string;
}
