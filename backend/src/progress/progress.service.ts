/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProgressResponseDto, UpdateProgressDto } from './dto/progress.dto';
import { ChainProgress } from './entities/chain.progress.entity'; // Assuming you have this entity

@Injectable()
export class ProgressService {
  constructor(
    @InjectRepository(ChainProgress)
    private progressRepository: Repository<ChainProgress>,
  ) {}

  // This will now fetch the progress from the database instead of mock data
  async findOne(id: number): Promise<ProgressResponseDto> {
    const progress = await this.progressRepository.findOne({
      where: { chainId: id },
    });

    if (!progress) {
      throw new NotFoundException('Progress not found');
    }

    return {
      chainId: id,
      progress: progress.currentStep,
      score: progress.score,
      completed: progress.completed,
      lastAttempt: progress.lastAttemptAt,
    };
  }
  private progress = {};

  getUserProgress(userId: string) {
    return this.progress[userId] || {};
  }
  updateChainProgress(userId: string, chainId: number, status: string) {
    this.progress[userId] = { [chainId]: status };
    return { message: 'Progress updated' };
  }
  update(
    id: number,
    updateProgressDto: UpdateProgressDto,
  ): Promise<ProgressResponseDto> {
    let progress = await this.progressRepository.findOne({
      where: { userId, chainId },
    });

    if (!progress) {
      progress = this.progressRepository.create({
        userId,
        chainId,
        currentStep: updateProgressDto.currentStep,
        completed: updateProgressDto.completed ?? false,
        score: updateProgressDto.score ?? 0,
        attemptsCount: 1,
      });
    } else {
      progress.currentStep = updateProgressDto.currentStep;
      if (updateProgressDto.completed !== undefined) {
        progress.completed = updateProgressDto.completed;
      }
      if (updateProgressDto.score !== undefined) {
        progress.score = updateProgressDto.score;
      }
      progress.attemptsCount += 1;
      progress.lastAttemptAt = new Date();
    }

    await this.progressRepository.save(progress);

    return {
      chainId,
      progress: progress.currentStep,
      score: progress.score,
      completed: progress.completed,
      lastAttempt: progress.lastAttemptAt,
    };
  }

  // Get user progress based on userId
  async getUserProgress(userId: number) {
    return this.progressRepository.find({
      where: { userId },
      order: { lastAttemptAt: 'DESC' },
    });
  }

  // Get specific chain progress for a user
  async getChainProgress(userId: number, chainId: number) {
    const progress = await this.progressRepository.findOne({
      where: { userId, chainId },
    });

    if (!progress) {
      throw new NotFoundException('Chain progress not found');
    }

    return progress;
  }

  // Calculate user progress stats (completion, average score, etc.)
  async getProgressStats(userId: number) {
    const progress = await this.progressRepository.find({
      where: { userId },
    });

    const completed = progress.filter((p) => p.completed);
    const totalAttempts = progress.reduce((sum, p) => sum + p.attemptsCount, 0);

    return {
      totalCompleted: completed.length,
      averageScore: completed.length
        ? completed.reduce((sum, p) => sum + p.score, 0) / completed.length
        : 0,
      totalAttempts,
      completionRate:
        progress.length > 0 ? (completed.length / progress.length) * 100 : 0,
    };
  }
}
