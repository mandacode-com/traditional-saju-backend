import { ApiProperty } from '@nestjs/swagger';

export class DailySajuResponseDto {
  @ApiProperty({ description: 'Name' })
  name: string;

  @ApiProperty({ description: 'Birth date and time' })
  birthDateTime: string;

  @ApiProperty({ enum: ['male', 'female'], description: 'Gender' })
  gender: 'male' | 'female';

  @ApiProperty({ description: 'Fortune score (0-100)' })
  fortuneScore: number;

  @ApiProperty({ description: 'Today\'s short message' })
  todayShortMessage: string;

  @ApiProperty({ description: 'Overall fortune message' })
  totalFortuneMessage: string;

  @ApiProperty({ description: 'Relationship fortune' })
  relationship: string;

  @ApiProperty({ description: 'Wealth fortune' })
  wealth: string;

  @ApiProperty({ description: 'Romantic fortune' })
  romantic: string;

  @ApiProperty({ description: 'Health fortune' })
  health: string;

  @ApiProperty({ description: 'Caution' })
  caution: string;

  @ApiProperty({ required: false, description: 'Answer to question' })
  questionAnswer?: string;
}
