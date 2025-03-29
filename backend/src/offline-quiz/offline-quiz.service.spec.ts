import { Test, TestingModule } from '@nestjs/testing';
import { OfflineQuizService } from './offline-quiz.service';

describe('OfflineQuizService', () => {
  let service: OfflineQuizService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OfflineQuizService],
    }).compile();

    service = module.get<OfflineQuizService>(OfflineQuizService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
