import { ApiProperty } from '@nestjs/swagger';
import { Gender } from '../../types/user.type';
import { ChartDto } from './chart.dto';

class YearlySajuDescriptionDto {
  @ApiProperty({ description: 'General description' })
  general: string;

  @ApiProperty({ description: 'Relationship description' })
  relationship: string;

  @ApiProperty({ description: 'Wealth description' })
  wealth: string;

  @ApiProperty({ description: 'Romantic description' })
  romantic: string;

  @ApiProperty({ description: 'Health description' })
  health: string;

  @ApiProperty({ description: 'Career description' })
  career: string;

  @ApiProperty({ description: 'Ways to improve' })
  waysToImprove: string;

  @ApiProperty({ description: 'Caution message' })
  caution: string;

  @ApiProperty({ description: 'Answer to user question', nullable: true })
  questionAnswer: string | null;
}

export class YearlySajuResponseDto {
  @ApiProperty({ description: 'User name' })
  name: string;

  @ApiProperty({ description: 'Birth date and time in ISO format' })
  birthDateTime: string;

  @ApiProperty({ enum: Gender, description: 'Gender' })
  gender: Gender;

  @ApiProperty({ type: ChartDto, description: 'Saju chart' })
  chart: ChartDto;

  @ApiProperty({ type: YearlySajuDescriptionDto, description: 'Description' })
  description: YearlySajuDescriptionDto;
}
