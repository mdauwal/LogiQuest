import { Test, TestingModule } from '@nestjs/testing';
import { OfflineQuizController } from './offline-quiz.controller';
import { OfflineQuizService } from './offline-quiz.service';

describe('OfflineQuizController', () => {
  let controller: OfflineQuizController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OfflineQuizController],
      providers: [OfflineQuizService],
    }).compile();

    controller = module.get<OfflineQuizController>(OfflineQuizController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
