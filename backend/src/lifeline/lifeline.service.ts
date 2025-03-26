import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GameSession } from '../game-sessions/entities/game-session.entity';
import { Puzzle } from '../puzzles/entities/puzzle.entity';

@Injectable()
export class LifelineService {
  constructor(
    @InjectRepository(GameSession)
    private readonly gameSessionRepository: Repository<GameSession>,
    @InjectRepository(Puzzle)
    private readonly puzzleRepository: Repository<Puzzle>,
  ) {}

  // 50/50 Lifeline: Eliminate two incorrect options
  async useFiftyFifty(
    gameSessionId: number,
    questionId: number,
  ): Promise<string[]> {
    const gameSession = await this.gameSessionRepository.findOne({
      where: { id: gameSessionId },
      relations: ['puzzle'],
    });

    if (!gameSession) {
      return [];
      //   throw new NotFoundException('Game session not found');
    }

    if (gameSession.isFiftyFiftyUsed) {
      throw new InternalServerErrorException('50/50 lifeline already used');
    }

    const puzzle = await this.puzzleRepository.findOne({
      where: { id: questionId },
      relations: ['steps'],
    });

    if (!puzzle) {
      throw new NotFoundException('Question not found');
    }

    if (!puzzle.steps || puzzle.steps.length === 0) {
      throw new NotFoundException('Puzzle steps not found');
    }

    const currentStep = puzzle.steps.find(
      (step) => step.order === gameSession.currentStep,
    );

    if (!currentStep) {
      throw new NotFoundException('Current step not found');
    }

    const { options, correctAnswer } = currentStep;

    // Filter out the correct answer and randomly remove two incorrect options
    const incorrectOptions = options.filter(
      (option) => option !== correctAnswer,
    );
    const removedOptions = incorrectOptions
      .sort(() => Math.random() - 0.5)
      .slice(0, 2);

    // Mark the lifeline as used
    gameSession.isFiftyFiftyUsed = true;
    await this.gameSessionRepository.save(gameSession);

    return options.filter((option) => !removedOptions.includes(option));
  }

  // Ask a Friend Lifeline: Generate a hint
  async useAskFriend(
    gameSessionId: number,
    questionId: number,
  ): Promise<string> {
    const gameSession = await this.gameSessionRepository.findOne({
      where: { id: gameSessionId },
      relations: ['puzzle'],
    });

    if (!gameSession) {
      return null;
      //   throw new NotFoundException('Game session not found');
    }

    if (gameSession.isAskFriendUsed) {
      throw new InternalServerErrorException(
        'Ak a friend lifeline already used',
      );
    }

    const puzzle = await this.puzzleRepository.findOne({
      where: { id: questionId },
      relations: ['steps'],
    });

    if (!puzzle) {
      throw new NotFoundException('Question not found');
    }

    if (!puzzle.steps || puzzle.steps.length === 0) {
      throw new NotFoundException('Puzzle steps not found');
    }

    const currentStep = puzzle.steps.find(
      (step) => step.order === gameSession.currentStep,
    );

    if (!currentStep) {
      throw new NotFoundException('Current step not found');
    }

    const { correctAnswer, hints } = currentStep;

    if (!correctAnswer || !hints || hints.length === 0) {
      throw new InternalServerErrorException('Invalid step data');
    }

    const hint: string = this.getHint(hints);

    // Mark the lifeline as used
    gameSession.isAskFriendUsed = true;
    await this.gameSessionRepository.save(gameSession);

    return hint;
  }

  // Check lifeline availability
  async checkLifelines(gameSessionId: number): Promise<{
    isFiftyFiftyAvailable: boolean;
    isAskFriendAvailable: boolean;
  }> {
    const gameSession = await this.gameSessionRepository.findOne({
      where: { id: gameSessionId },
    });

    if (!gameSession) {
      return null;
      //   throw new NotFoundException('Session not found');
    }

    return {
      isFiftyFiftyAvailable: !gameSession.isFiftyFiftyUsed,
      isAskFriendAvailable: !gameSession.isAskFriendUsed,
    };
  }

  getHint<T>(array: T[]): T {
    if (array.length === 0) {
      throw new InternalServerErrorException('No hints available');
    }
    const randomIndex = Math.floor(Math.random() * array.length);

    return array[randomIndex];
  }
}
