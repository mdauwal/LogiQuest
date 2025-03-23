import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual } from 'typeorm';
import { QuizResult } from './entities/quiz-result.entity';
import { User } from 'src/users/entities/user.entity'; // adapt to your user entity
import * as moment from 'moment';

@Injectable()
export class LeaderboardsService {
  constructor(
    @InjectRepository(QuizResult)
    private readonly quizResultRepo: Repository<QuizResult>,
  ) {}

  /**
   * Returns aggregated leaderboard data.
   * @param category optional quiz category filter
   * @param period "all-time" | "monthly" | "weekly"
   * @param page pagination page
   * @param limit number of items per page
   */
  async getLeaderboard(
    category?: string,
    period: string = 'all-time',
    page: number = 1,
    limit: number = 10,
  ) {
    const where: any = {};
    if (category) {
      where.category = category;
    }

    // Time period filter
    if (period === 'weekly') {
      const startOfWeek = moment().startOf('isoWeek').toDate();
      where.createdAt = MoreThanOrEqual(startOfWeek);
    } else if (period === 'monthly') {
      const startOfMonth = moment().startOf('month').toDate();
      where.createdAt = MoreThanOrEqual(startOfMonth);
    }
    // "all-time" => no date filter

    // Query for aggregated scores
    // TypeORM raw query approach:
    const [rows, total] = await this.quizResultRepo
      .createQueryBuilder('qr')
      .select('qr.userId', 'userId')
      .addSelect('SUM(qr.score)', 'totalScore')
      .where(where)
      .groupBy('qr.userId')
      .orderBy('SUM(qr.score)', 'DESC')
      .offset((page - 1) * limit)
      .limit(limit)
      .getRawAndEntities();

    const leaderboard = rows.map((row, index) => ({
      userId: row.userId,
      totalScore: parseInt(row.totalScore, 10),
      rank: (page - 1) * limit + (index + 1),
    }));

    return {
      data: leaderboard,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Returns the ranking of the currently authenticated user.
   */
  async getUserRank(user: User, category?: string, period: string = 'all-time') {
    const userTotalScore = await this.getUserTotalScore(user, category, period);

    // If user has no score, rank is null (or last place)
    if (!userTotalScore) {
      return { rank: null, totalScore: 0 };
    }

    const countHigher = await this.countUsersWithHigherScore(
      userTotalScore,
      category,
      period,
    );

    return {
      rank: countHigher + 1,
      totalScore: userTotalScore,
    };
  }

  private async getUserTotalScore(
    user: User,
    category?: string,
    period?: string,
  ): Promise<number> {
    const where: any = { user: { id: user.id } };
    if (category) {
      where.category = category;
    }

    if (period === 'weekly') {
      const startOfWeek = moment().startOf('isoWeek').toDate();
      where.createdAt = MoreThanOrEqual(startOfWeek);
    } else if (period === 'monthly') {
      const startOfMonth = moment().startOf('month').toDate();
      where.createdAt = MoreThanOrEqual(startOfMonth);
    }

    const { sum } = await this.quizResultRepo
      .createQueryBuilder('qr')
      .select('SUM(qr.score)', 'sum')
      .where(where)
      .getRawOne();

    return sum ? parseInt(sum, 10) : 0;
  }

  private async countUsersWithHigherScore(
    userScore: number,
    category?: string,
    period?: string,
  ): Promise<number> {
    const where: any = {};
    if (category) {
      where.category = category;
    }

    if (period === 'weekly') {
      const startOfWeek = moment().startOf('isoWeek').toDate();
      where.createdAt = MoreThanOrEqual(startOfWeek);
    } else if (period === 'monthly') {
      const startOfMonth = moment().startOf('month').toDate();
      where.createdAt = MoreThanOrEqual(startOfMonth);
    }

    const qb = this.quizResultRepo
      .createQueryBuilder('qr')
      .select('qr.userId', 'userId')
      .addSelect('SUM(qr.score)', 'totalScore')
      .where(where)
      .groupBy('qr.userId')
      .having('SUM(qr.score) > :userScore', { userScore });

    const raw = await qb.getRawMany();
    return raw.length;
  }

  /**
   * Called after a quiz is completed to update the leaderboard in real-time.
   * Insert a new record in the DB or update an existing record, etc.
   */
  async updateLeaderboardOnQuizCompletion(
    userId: number,
    category: string,
    score: number,
  ) {
    const newResult = this.quizResultRepo.create({
      user: { id: userId } as User,
      category,
      score,
    });
    await this.quizResultRepo.save(newResult);
    // Optionally update cache, broadcast events, etc.
  }
}
