import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Quiz } from '../entities/quiz.entity';
import { Question } from '../entities/question.entity';
import { Option } from '../entities/option.entity';

@Injectable()
export class QuizService {
  constructor(
    @InjectRepository(Quiz)
    private quizRepository: Repository<Quiz>,
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
    @InjectRepository(Option)
    private optionRepository: Repository<Option>,
  ) {}

  /**
   * Get quiz with all questions and options for offline use
   */
  async getQuizWithQuestionsForOffline(quizId: string): Promise<any> {
    // Get the quiz
    const quiz = await this.quizRepository.findOne({
      where: { id: quizId },
      select: ['id', 'title', 'description', 'timeLimit', 'passingScore']
    });
    
    if (!quiz) {
      throw new Error('Quiz not found');
    }
    
    // Get all questions for the quiz
    const questions = await this.questionRepository.find({
      where: { quizId },
      select: ['id', 'text', 'points', 'order']
    });
    
    // Get all options for all questions
    const questionIds = questions.map(q => q.id);
    const options = await this.optionRepository.find({
      where: { questionId: In(questionIds) },
      select: ['id', 'questionId', 'text', 'isCorrect', 'order']
    });
    
    // Format the data for offline use
    const formattedQuestions = questions.map(question => {
      const questionOptions = options.filter(option => option.questionId === question.id);
      
      return {
        id: question.id,
        text: question.text,
        points: question.points,
        order: question.order,
        options: questionOptions.map(option => ({
          id: option.id,
          text: option.text,
          // Only include isCorrect in development mode or if the quiz is for practice
          isCorrect: process.env.NODE_ENV === 'development' ? option.isCorrect : undefined,
          order: option.order
        }))
      };
    });
    
    return {
      id: quiz.id,
      title: quiz.title,
      description: quiz.description,
      timeLimit: quiz.timeLimit,
      passingScore: quiz.passingScore,
      questions: formattedQuestions
    };
  }
}