import { Injectable } from '@nestjs/common';
import { CreateOfflineQuizDto } from './dto/create-offline-quiz.dto';
import { UpdateOfflineQuizDto } from './dto/update-offline-quiz.dto';

@Injectable()
export class OfflineQuizService {
  create(createOfflineQuizDto: CreateOfflineQuizDto) {
    return 'This action adds a new offlineQuiz';
  }

  findAll() {
    return `This action returns all offlineQuiz`;
  }

  findOne(id: number) {
    return `This action returns a #${id} offlineQuiz`;
  }

  update(id: number, updateOfflineQuizDto: UpdateOfflineQuizDto) {
    return `This action updates a #${id} offlineQuiz`;
  }

  remove(id: number) {
    return `This action removes a #${id} offlineQuiz`;
  }
}
