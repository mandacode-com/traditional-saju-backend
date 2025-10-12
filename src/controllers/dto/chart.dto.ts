import { ApiProperty } from '@nestjs/swagger';
import {
  EarthlyBranch,
  FiveElement,
  HeavenlyStem,
} from '../../types/chart.type';

class PillarDataDto {
  @ApiProperty({ enum: HeavenlyStem })
  year: HeavenlyStem;

  @ApiProperty({ enum: HeavenlyStem })
  month: HeavenlyStem;

  @ApiProperty({ enum: HeavenlyStem })
  day: HeavenlyStem;

  @ApiProperty({ enum: HeavenlyStem, nullable: true })
  hour: HeavenlyStem | null;
}

class FiveElementPillarDto {
  @ApiProperty({ enum: FiveElement })
  year: FiveElement;

  @ApiProperty({ enum: FiveElement })
  month: FiveElement;

  @ApiProperty({ enum: FiveElement })
  day: FiveElement;

  @ApiProperty({ enum: FiveElement, nullable: true })
  hour: FiveElement | null;
}

class EarthlyBranchPillarDto {
  @ApiProperty({ enum: EarthlyBranch })
  year: EarthlyBranch;

  @ApiProperty({ enum: EarthlyBranch })
  month: EarthlyBranch;

  @ApiProperty({ enum: EarthlyBranch })
  day: EarthlyBranch;

  @ApiProperty({ enum: EarthlyBranch, nullable: true })
  hour: EarthlyBranch | null;
}

class HeavenlyDto {
  @ApiProperty({ type: PillarDataDto })
  stems: PillarDataDto;

  @ApiProperty({ type: FiveElementPillarDto })
  fiveElements: FiveElementPillarDto;
}

class EarthlyDto {
  @ApiProperty({ type: EarthlyBranchPillarDto })
  branches: EarthlyBranchPillarDto;

  @ApiProperty({ type: FiveElementPillarDto })
  fiveElements: FiveElementPillarDto;
}

export class ChartDto {
  @ApiProperty({ type: HeavenlyDto })
  heavenly: HeavenlyDto;

  @ApiProperty({ type: EarthlyDto })
  earthly: EarthlyDto;
}
