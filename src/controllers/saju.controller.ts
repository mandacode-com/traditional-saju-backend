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
import { ZodValidationPipe } from '../pipes/zod-validation.pipe';
import {
  DailySajuRequest,
  DailySajuRequestSchema,
} from '../services/types/daily-saju.type';
import { DailySajuResult } from '../services/types/daily-saju.type';
import {
  YearlySajuRequest,
  YearlySajuRequestSchema,
} from '../services/types/yearly-saju.type';
import { YearlySajuResponse } from '../services/types/yearly-saju.type';
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
    @Body(
      new ZodValidationPipe(
        DailySajuRequestSchema.omit({ userId: true, userName: true }),
      ),
    )
    body: Omit<DailySajuRequest, 'userId' | 'userName'>,
    @User('userId') userId?: string,
    @User('userName') userName?: string,
  ): Promise<DailySajuResult> {
    if (!userId || !userName) {
      throw new UnauthorizedException('User not authenticated');
    }

    return this.dailySajuService.readSaju({
      ...body,
      userId,
      userName,
    });
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
    @Body(
      new ZodValidationPipe(
        YearlySajuRequestSchema.omit({ userId: true, userName: true }),
      ),
    )
    body: Omit<YearlySajuRequest, 'userId' | 'userName'>,
    @User('userId') userId?: string,
    @User('userName') userName?: string,
  ): Promise<YearlySajuResponse> {
    if (!userId || !userName) {
      throw new UnauthorizedException('User not authenticated');
    }

    return this.yearlySajuService.readSaju({
      ...body,
      userId,
      userName,
    });
  }
}
