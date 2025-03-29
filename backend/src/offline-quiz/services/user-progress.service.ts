import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserProgress } from '../entities/user-progress.entity';

@Injectable()
export class UserProgressService {
  constructor(
    @InjectRepository(UserProgress)
    private userProgressRepository: Repository<UserProgress>,
  ) {}

  /**
   * Get quiz progress for a user
   */
  async getQuizProgress(userId: string, quizId: string): Promise<UserProgress | null> {
    return this.userProgressRepository.findOne({
      where: { userId, quizId }
    });
  }

  /**
   * Update quiz progress for a user
   */
  async updateQuizProgress(userId: string, quizId: string, progressData: any): Promise<UserProgress> {
    let progress = await this.getQuizProgress(userId, quizId);
    
    if (!progress) {
      progress = new UserProgress();
      progress.userId = userId;
      progress.quizId = quizId;
    }
    
    // Update properties from progressData
    progress.answers = progressData.answers;
    progress.completed = progressData.completed;
    progress.score = progressData.score;
    progress.lastUpdated = new Date();
    
    return this.userProgressRepository.save(progress);
  }
  
  /**
   * Resolves conflicts between existing and incoming progress data
   */
  private resolveProgressConflict(existingProgress: UserProgress, incomingProgress: any): UserProgress {
    // Implementation would be similar to the client-side conflict resolution
    // but adapted for server-side entities
    
    // This is a simplified implementation - in a real system, you would have more complex logic
    const existingLastUpdated = existingProgress.lastUpdated.getTime();
    const incomingLastUpdated = new Date(incomingProgress.lastUpdated).getTime();
    
    // If incoming data is newer, prefer it
    if (incomingLastUpdated > existingLastUpdated) {
      existingProgress.answers = incomingProgress.answers;
      existingProgress.completed = incomingProgress.completed;
      existingProgress.score = incomingProgress.score;
      existingProgress.lastUpdated = new Date(incomingLastUpdated);
      return existingProgress;
    }
    
    // Merge answers by taking the most recent answer for each question
    const mergedAnswers = this.mergeAnswers(existingProgress.answers, incomingProgress.answers);
    existingProgress.answers = mergedAnswers;
    
    // Take the highest completion status (if either is complete, mark as complete)
    existingProgress.completed = existingProgress.completed || incomingProgress.completed;
    
    // Recalculate score based on merged answers
    existingProgress.score = this.calculateScore(mergedAnswers);
    
    // Update last updated timestamp to now
    existingProgress.lastUpdated = new Date();
    
    return existingProgress;
  }
  
  /**
   * Merges answer lists from existing and incoming data
   */
  private mergeAnswers(existingAnswers: any[], incomingAnswers: any[]): any[] {
    const answerMap = new Map<string, any>();
    
    // Add existing answers to the map
    for (const answer of existingAnswers) {
      answerMap.set(answer.questionId, answer);
    }
    
    // Add incoming answers to the map, overwriting existing when incoming is newer
    for (const answer of incomingAnswers) {
      const existingAnswer = answerMap.get(answer.questionId);
      
      if (!existingAnswer || new Date(answer.answeredAt) > new Date(existingAnswer.answeredAt)) {
        answerMap.set(answer.questionId, answer);
      }
    }
    
    // Convert map back to array
    return Array.from(answerMap.values());
  }
  
  /**
   * Calculates score based on merged answers
   */
  private calculateScore(answers: any[]): number {
    // In a real application, you would fetch correct answers and calculate
    return answers.length > 0 ? (answers.length * 10) : 0;
  }
}