import { ApiProperty } from '@nestjs/swagger';

export class DailySajuRequestDto {
  @ApiProperty({ example: '2000-01-01T12:00:00Z', description: 'Birth date and time' })
  birthDateTime: string;

  @ApiProperty({ enum: ['male', 'female'], description: 'Gender' })
  gender: 'male' | 'female';

  @ApiProperty({
    enum: ['single', 'dating', 'married'],
    description: 'Dating status',
  })
  datingStatus: 'single' | 'dating' | 'married';

  @ApiProperty({
    enum: ['employed', 'unemployed', 'student', 'self-employed'],
    description: 'Job status',
  })
  jobStatus: 'employed' | 'unemployed' | 'student' | 'self-employed';

  @ApiProperty({ required: false, description: 'Optional question' })
  question?: string;
}
