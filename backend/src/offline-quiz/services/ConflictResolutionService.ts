import { UserProgress } from './LocalStorageService';

export class ConflictResolutionService {
  /**
   * Resolves conflicts between local and server quiz progress
   * Prioritizes the most recent data while preserving all answers
   */
  public resolveProgressConflict(
    localProgress: UserProgress,
    serverProgress: UserProgress
  ): UserProgress {
    // If one is significantly newer than the other, use the newer one
    const timeDifference = Math.abs(localProgress.lastUpdated - serverProgress.lastUpdated);
    const SIGNIFICANT_TIME_DIFFERENCE = 3600000; // 1 hour in milliseconds
    
    if (timeDifference > SIGNIFICANT_TIME_DIFFERENCE) {
      return localProgress.lastUpdated > serverProgress.lastUpdated
        ? localProgress
        : serverProgress;
    }
    
    // Otherwise, merge the data
    const mergedAnswers = this.mergeAnswers(localProgress.answers, serverProgress.answers);
    
    // Calculate the merged score
    const calculatedScore = this.calculateScore(mergedAnswers);
    
    // Determine if the quiz is completed in either version
    const isCompleted = localProgress.completed || serverProgress.completed;
    
    // Use the most recent timestamp
    const lastUpdated = Math.max(localProgress.lastUpdated, serverProgress.lastUpdated);
    
    return {
      quizId: localProgress.quizId,
      answers: mergedAnswers,
      completed: isCompleted,
      score: calculatedScore,
      lastUpdated
    };
  }

  /**
   * Merges answer lists from local and server data
   * Prioritizes local answers in case of conflicts on the same question
   */
  private mergeAnswers(
    localAnswers: UserProgress['answers'],
    serverAnswers: UserProgress['answers']
  ): UserProgress['answers'] {
    // Create a map of question IDs to answers
    const answerMap = new Map<
      string,
      { questionId: string; selectedOptionId: string; answeredAt: number }
    >();
    
    // Add server answers to the map
    for (const answer of serverAnswers) {
      answerMap.set(answer.questionId, answer);
    }
    
    // Add local answers to the map, overwriting server answers when the local is newer
    for (const answer of localAnswers) {
      const existingAnswer = answerMap.get(answer.questionId);
      
      if (!existingAnswer || answer.answeredAt > existingAnswer.answeredAt) {
        answerMap.set(answer.questionId, answer);
      }
    }
    
    // Convert map back to array
    return Array.from(answerMap.values());
  }

  /**
   * Calculates score based on merged answers
   * (This is a placeholder - actual scoring logic would depend on your quiz system)
   */
  private calculateScore(answers: UserProgress['answers']): number {
    // In a real application, you would fetch correct answers and calculate
    // For this implementation, we'll return a placeholder value
    return answers.length > 0 ? (answers.length * 10) : 0;
  }
}

export const conflictResolutionService = new ConflictResolutionService();