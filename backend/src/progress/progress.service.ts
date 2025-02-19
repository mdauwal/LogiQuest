/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { ProgressResponseDto, UpdateProgressDto } from './dto/progress.dto';

@Injectable()
export class ProgressService {
  findOne(id: number): Promise<ProgressResponseDto> {
    return Promise.resolve({
      chainId: id,
      progress: 0,
      score: 0,
      completed: false,
      lastAttempt: new Date(),
    });
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
    return Promise.resolve({
      chainId: id,
      progress: updateProgressDto.currentStep,
      score: updateProgressDto.score,
      completed: updateProgressDto.completed,
      lastAttempt: new Date(),
    });
  }
}
