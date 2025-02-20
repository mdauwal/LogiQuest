import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import type { Repository } from "typeorm"
import { GameSession } from "../game-sessions/entities/game-session.entity"
import { Logger } from "@nestjs/common"

@Injectable()
export class AnalyticsService {
  private readonly logger = new Logger(AnalyticsService.name);

  constructor(
    @InjectRepository(GameSession)
    private gameSessionRepository: Repository<GameSession>,
  ) {}

  async getCompletionRate(): Promise<number> {
    try {
      const [completedSessions, totalSessions] = await Promise.all([
        this.gameSessionRepository.count({ where: { status: "completed" } }),
        this.gameSessionRepository.count(),
      ])

      return totalSessions > 0 ? completedSessions / totalSessions : 0
    } catch (error) {
      this.logger.error(`Failed to calculate completion rate: ${error.message}`, error.stack)
      throw error
    }
  }

  async getAverageTimeSpent(): Promise<number> {
    try {
      const result = await this.gameSessionRepository
        .createQueryBuilder("session")
        .select("AVG(EXTRACT(EPOCH FROM (session.lastActive - session.startTime)))", "averageTime")
        .getRawOne()

      return result.averageTime || 0
    } catch (error) {
      this.logger.error(`Failed to calculate average time spent: ${error.message}`, error.stack)
      throw error
    }
  }

  async getAverageAttempts(): Promise<number> {
    try {
      const result = await this.gameSessionRepository
        .createQueryBuilder("session")
        .select("AVG(session.attempts)", "averageAttempts")
        .getRawOne()

      return result.averageAttempts || 0
    } catch (error) {
      this.logger.error(`Failed to calculate average attempts: ${error.message}`, error.stack)
      throw error
    }
  }

  async getSuccessRate(): Promise<number> {
    try {
      const [successfulSessions, totalSessions] = await Promise.all([
        this.gameSessionRepository.count({ where: { status: "completed", attempts: 1 } }),
        this.gameSessionRepository.count(),
      ])

      return totalSessions > 0 ? successfulSessions / totalSessions : 0
    } catch (error) {
      this.logger.error(`Failed to calculate success rate: ${error.message}`, error.stack)
      throw error
    }
  }
}

