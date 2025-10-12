import {
  Body,
  Controller,
  HttpCode,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { User } from '../decorators/user.decorator';
import { DailySajuService } from '../services/daily-saju.service';
import { YearlySajuService } from '../services/yearly-saju.service';
import {
  DailySajuResult,
  DailySajuRequest,
} from '../services/types/daily-saju.type';
import {
  YearlySajuResponse,
  YearlySajuRequest,
} from '../services/types/yearly-saju.type';
import { DailySajuRequestDto } from './dto/daily-saju-request.dto';
import { DailySajuResponseDto } from './dto/daily-saju-response.dto';
import { YearlySajuRequestDto } from './dto/yearly-saju-request.dto';
import { YearlySajuResponseDto } from './dto/yearly-saju-response.dto';
@ApiTags('saju')
@ApiBearerAuth()
@Controller('saju')
export class SajuController {
  constructor(
    private readonly dailySajuService: DailySajuService,
    private readonly yearlySajuService: YearlySajuService,
  ) {}

  @Post('daily')
  @HttpCode(200)
  @ApiOperation({ summary: 'Get daily fortune' })
  @ApiBody({ type: DailySajuRequestDto })
  @ApiResponse({
    status: 200,
    description: 'Daily fortune retrieved successfully',
    type: DailySajuResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getDailySaju(
    @Body() body: DailySajuRequestDto,
    @User('userId') userId?: string,
    @User('userName') userName?: string,
  ): Promise<DailySajuResult> {
    if (!userId || !userName) {
      throw new UnauthorizedException('User not authenticated');
    }

    const request: DailySajuRequest = {
      userId,
      userName,
      gender: body.gender,
      birthDateTime: body.birthDateTime,
      datingStatus: body.datingStatus,
      jobStatus: body.jobStatus,
      question: body.question,
    };

    return this.dailySajuService.readSaju(request);
  }

  @Post('yearly')
  @HttpCode(200)
  @ApiOperation({ summary: 'Get yearly fortune' })
  @ApiBody({ type: YearlySajuRequestDto })
  @ApiResponse({
    status: 200,
    description: 'Yearly fortune retrieved successfully',
    type: YearlySajuResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getYearlySaju(
    @Body() body: YearlySajuRequestDto,
    @User('userId') userId?: string,
    @User('userName') userName?: string,
  ): Promise<YearlySajuResponse> {
    if (!userId || !userName) {
      throw new UnauthorizedException('User not authenticated');
    }

    // Convert DTO to service request
    const birthDateTime = new Date(
      `${body.birthDate}T${body.birthTime}:00.000Z`,
    ).toISOString();

    const request: YearlySajuRequest = {
      userId,
      userName,
      gender: body.gender,
      birthDateTime,
      birthTimeDisabled: body.isBirthTimeUnknown ?? false,
      datingStatus: body.datingStatus,
      jobStatus: body.jobStatus,
      question: body.question,
    };

    return this.yearlySajuService.readSaju(request);
  }
}
