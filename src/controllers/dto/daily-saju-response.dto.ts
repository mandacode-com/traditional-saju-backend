import { ApiProperty } from '@nestjs/swagger';
import { Gender } from '../../types/user.type';

export class DailySajuResponseDto {
  @ApiProperty({ description: 'User name' })
  name: string;

  @ApiProperty({ description: 'Birth date and time in ISO format' })
  birthDateTime: string;

  @ApiProperty({ enum: Gender, description: 'Gender' })
  gender: Gender;

  @ApiProperty({ description: 'Fortune score', example: 85 })
  fortuneScore: number;

  @ApiProperty({ description: 'Today short message' })
  todayShortMessage: string;

  @ApiProperty({ description: 'Total fortune message' })
  totalFortuneMessage: string;

  @ApiProperty({ description: 'Relationship fortune' })
  relationship: string;

  @ApiProperty({ description: 'Wealth fortune' })
  wealth: string;

  @ApiProperty({ description: 'Romantic fortune' })
  romantic: string;

  @ApiProperty({ description: 'Health fortune' })
  health: string;

  @ApiProperty({ description: 'Caution message' })
  caution: string;

  @ApiProperty({ description: 'Answer to user question', nullable: true })
  questionAnswer: string | null;
}
