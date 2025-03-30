import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { QuizService } from "./quiz.service"
import { QuizController } from "./quiz.controller"
import { Quiz } from "./entities/quiz.entity"
import { Question } from "./entities/question.entity"
import { UserQuiz } from "./entities/user-quiz.entity"

@Module({
  imports: [TypeOrmModule.forFeature([Quiz, Question, UserQuiz])],
  providers: [QuizService],
  controllers: [QuizController],
  exports: [QuizService],
})
export class QuizModule {}

