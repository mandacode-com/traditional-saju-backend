import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsBoolean,
  Matches,
} from 'class-validator';
import { Gender, DatingStatus, JobStatus } from '../../types/user.type';

export class YearlySajuRequestDto {
  @ApiProperty({ example: '2000-01-01', description: 'Birth date' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'birthDate must be in YYYY-MM-DD format',
  })
  birthDate: string;

  @ApiProperty({ example: '12:00', description: 'Birth time' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{2}:\d{2}$/, { message: 'birthTime must be in HH:mm format' })
  birthTime: string;

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

  @ApiProperty({ required: false, description: 'Is leap month' })
  @IsBoolean()
  @IsOptional()
  isLeapMonth?: boolean;

  @ApiProperty({ required: false, description: 'Birth time unknown' })
  @IsBoolean()
  @IsOptional()
  isBirthTimeUnknown?: boolean;

  @ApiProperty({ required: false, description: 'Optional question' })
  @IsString()
  @IsOptional()
  question?: string;
}
