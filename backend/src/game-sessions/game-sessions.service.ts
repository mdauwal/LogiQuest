import { Injectable, NotFoundException, InternalServerErrorException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import type { Repository } from "typeorm"
import { InjectRedis } from "@nestjs-modules/ioredis";
import type { Redis } from "ioredis";
import { Cron, CronExpression } from "@nestjs/schedule"
import { GameSession } from "./entities/game-session.entity"
import type { CreateGameSessionDto } from "./dto/create-game-session.dto"
import { User } from "../users/entities/user.entity"
import { Chain } from "../chains/entities/chain.entity"
import { Logger } from "@nestjs/common"
import { MoreThanOrEqual } from "typeorm"

@Injectable()
export class GameSessionsService {
  private readonly logger = new Logger(GameSessionsService.name);

  constructor(
    @InjectRepository(GameSession)
    private gameSessionRepository: Repository<GameSession>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Chain)
    private chainRepository: Repository<Chain>,
    @InjectRedis() private readonly redis: Redis,
    @InjectRepository(GameSession)
    private gameSessionsRepository: Repository<GameSession>,
  ) {}

  private async cacheGameSession(gameSession: GameSession): Promise<void> {
    try {
      await this.redis.set(`gameSession:${gameSession.id}`, JSON.stringify(gameSession), "EX", 3600)
    } catch (error) {
      this.logger.error(`Failed to cache game session: ${error.message}`, error.stack)
    }
  }

  private async getCachedGameSession(id: number): Promise<GameSession | null> {
    try {
      const cachedSession = await this.redis.get(`gameSession:${id}`)
      return cachedSession ? JSON.parse(cachedSession) : null
    } catch (error) {
      this.logger.error(`Failed to get cached game session: ${error.message}`, error.stack)
      return null
    }
  }

  async findAll(): Promise<GameSession[]> {
    return this.gameSessionRepository.find();
  }

  async findActiveByUser(userId: number): Promise<GameSession[]> {
    return this.gameSessionRepository.find({
      where: { user: { id: userId }, status: "active" },
    });
  }
  
  async getSessionHistory(userId: number): Promise<GameSession[]> {
    return this.gameSessionRepository.find({
      where: { user: { id: userId }, status: "completed" },
    });
  }
  
  async completeSession(id: number): Promise<void> {
    await this.gameSessionRepository.update(id, { status: "completed" });
  }
  
  async remove(id: number): Promise<void> {
    await this.gameSessionRepository.delete(id);
  }
  
  async update(id: number, updateData: Partial<GameSession>): Promise<GameSession> {
    const gameSession = await this.gameSessionsRepository.findOne({ where: { id } });
    if (!gameSession) {
      throw new NotFoundException(`GameSession with ID ${id} not found`);
    }
    Object.assign(gameSession, updateData);
    return this.gameSessionsRepository.save(gameSession);
}


  

  async create(createGameSessionDto: CreateGameSessionDto): Promise<GameSession> {
    try {
      const user = await this.userRepository.findOne({ where: { id: createGameSessionDto.userId } });
      const chain = await this.chainRepository.findOne({ where: { id: createGameSessionDto.chainId } });      

      if (!user || !chain) {
        throw new NotFoundException("User or Chain not found")
      }

      const gameSession = this.gameSessionRepository.create({
        user,
        chain,
        currentStep: 0,
        score: 0,
        status: "active",
        attempts: 1,
      })

      const savedSession = await this.gameSessionRepository.save(gameSession)
      await this.cacheGameSession(savedSession)
      return savedSession
    } catch (error) {
      this.logger.error(`Failed to create game session: ${error.message}`, error.stack)
      throw new InternalServerErrorException("Failed to create game session")
    }
  }

  async findOne(id: number): Promise<GameSession> {
    try {
      const cachedSession = await this.getCachedGameSession(id)
      if (cachedSession) {
        return cachedSession
      }

      const gameSession = await this.gameSessionRepository.findOne({
        where: { id }, 
        relations: ["user", "chain"], 
      });
      
      if (!gameSession) {
        throw new NotFoundException(`Game session with ID "${id}" not found`)
      }

      await this.cacheGameSession(gameSession)
      return gameSession
    } catch (error) {
      this.logger.error(`Failed to find game session: ${error.message}`, error.stack)
      if (error instanceof NotFoundException) {
        throw error
      }
      throw new InternalServerErrorException("Failed to find game session")
    }
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async handleSessionTimeouts() {
    try {
      const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000)
      const timedOutSessions = await this.gameSessionRepository.find({
        where: {
          status: "active",
          lastActive: MoreThanOrEqual(thirtyMinutesAgo),
        },
      })

      for (const session of timedOutSessions) {
        session.status = "abandoned"
        await this.gameSessionRepository.save(session)
        await this.redis.del(`gameSession:${session.id}`)
      }

      this.logger.log(`Handled timeouts for ${timedOutSessions.length} sessions`)
    } catch (error) {
      this.logger.error(`Failed to handle session timeouts: ${error.message}`, error.stack)
    }
  }
}

