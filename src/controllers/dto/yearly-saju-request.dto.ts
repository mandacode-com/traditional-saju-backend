import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsBoolean,
  IsISO8601,
} from 'class-validator';
import { Gender, DatingStatus, JobStatus } from '../../types/user.type';

export class YearlySajuRequestDto {
  @ApiProperty({
    example: '2000-01-01T12:00:00Z',
    description: 'Birth date and time',
  })
  @IsString()
  @IsNotEmpty()
  @IsISO8601()
  birthDateTime: string;

  @ApiProperty({ enum: Gender, description: 'Gender' })
  @IsEnum(Gender)
  gender: Gender;

  @ApiProperty({
    enum: DatingStatus,
    description: 'Dating status',
  })
  @IsEnum(DatingStatus)
  datingStatus: DatingStatus;

  @ApiProperty({
    enum: JobStatus,
    description: 'Job status',
  })
  @IsEnum(JobStatus)
  jobStatus: JobStatus;

  @ApiProperty({ required: false, description: 'Birth time unknown' })
  @IsBoolean()
  @IsOptional()
  birthTimeDisabled?: boolean;

  @ApiProperty({ required: false, description: 'Optional question' })
  @IsString()
  @IsOptional()
  question?: string;
}
