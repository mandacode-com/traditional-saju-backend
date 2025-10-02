import { ApiProperty } from '@nestjs/swagger';

class SajuChartDto {
  @ApiProperty({ description: 'Year heavenly stem' })
  yearSky: string;

  @ApiProperty({ description: 'Year earthly branch' })
  yearEarth: string;

  @ApiProperty({ description: 'Month heavenly stem' })
  monthSky: string;

  @ApiProperty({ description: 'Month earthly branch' })
  monthEarth: string;

  @ApiProperty({ description: 'Day heavenly stem' })
  daySky: string;

  @ApiProperty({ description: 'Day earthly branch' })
  dayEarth: string;

  @ApiProperty({ required: false, description: 'Time heavenly stem' })
  timeSky?: string;

  @ApiProperty({ required: false, description: 'Time earthly branch' })
  timeEarth?: string;
}

export class YearlySajuResponseDto {
  @ApiProperty({ description: 'Name' })
  name: string;

  @ApiProperty({ description: 'Birth date' })
  birthDate: string;

  @ApiProperty({ description: 'Birth time' })
  birthTime: string;

  @ApiProperty({ enum: ['male', 'female'], description: 'Gender' })
  gender: 'male' | 'female';

  @ApiProperty({ description: 'Saju chart', type: SajuChartDto })
  chart: SajuChartDto;

  @ApiProperty({ description: 'General fortune' })
  general: string;

  @ApiProperty({ description: 'Relationship fortune' })
  relationship: string;

  @ApiProperty({ description: 'Wealth fortune' })
  wealth: string;

  @ApiProperty({ description: 'Romantic fortune' })
  romantic: string;

  @ApiProperty({ description: 'Health fortune' })
  health: string;

  @ApiProperty({ description: 'Career fortune' })
  career: string;

  @ApiProperty({ description: 'Ways to improve fortune' })
  waysToImprove: string;

  @ApiProperty({ description: 'Caution' })
  caution: string;

  @ApiProperty({ required: false, description: 'Answer to question' })
  questionAnswer?: string;
}
