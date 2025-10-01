import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { ScoreService } from './score.service';

describe('ScoreService', () => {
  let service: ScoreService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ScoreService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue({
              mean: 50,
              stdDev: 15,
            }),
          },
        },
      ],
    }).compile();

    service = module.get<ScoreService>(ScoreService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateScore', () => {
    it('should generate a score between 0 and 100', () => {
      const score = service.generateScore();
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(100);
    });

    it('should generate different scores on multiple calls', () => {
      const scores = Array.from({ length: 100 }, () => service.generateScore());
      const uniqueScores = new Set(scores);

      // With 100 calls, we should have multiple unique values
      expect(uniqueScores.size).toBeGreaterThan(1);
    });

    it('should generate scores that follow normal distribution pattern', () => {
      const iterations = 1000;
      const scores = Array.from({ length: iterations }, () =>
        service.generateScore(),
      );

      const mean = scores.reduce((a, b) => a + b, 0) / iterations;
      const variance =
        scores.reduce((sum, score) => sum + Math.pow(score - mean, 2), 0) /
        iterations;
      const stdDev = Math.sqrt(variance);

      // Mean should be close to configured mean (50)
      expect(mean).toBeGreaterThan(40);
      expect(mean).toBeLessThan(60);

      // StdDev should be reasonable
      expect(stdDev).toBeGreaterThan(10);
      expect(stdDev).toBeLessThan(20);
    });

    it('should return integer values', () => {
      const scores = Array.from({ length: 100 }, () => service.generateScore());
      scores.forEach((score) => {
        expect(Number.isInteger(score)).toBe(true);
      });
    });
  });
});
