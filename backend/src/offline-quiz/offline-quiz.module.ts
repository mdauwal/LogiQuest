import { Module } from '@nestjs/common';
import { OfflineQuizService } from './offline-quiz.service';
import { OfflineQuizController } from './offline-quiz.controller';

@Module({
  controllers: [OfflineQuizController],
  providers: [OfflineQuizService],
})
export class OfflineQuizModule {}
