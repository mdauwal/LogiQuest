import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';
import { Puzzle } from '../puzzles/entities/puzzle.entity';
import type { PuzzleDifficulty } from '../puzzles/entities/puzzle.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Puzzle)
    private readonly puzzleRepository: Repository<Puzzle>,
  ) {}

  // List all available categories
  async listCategories(): Promise<string[]> {
    const queryBuilder = this.puzzleRepository.createQueryBuilder('puzzle');
    const categories = await queryBuilder
      .select('DISTINCT(puzzle.category)', 'category')
      .getRawMany();
      console.log("C: ", categories)
    return categories.map((c) => c.category);
  }

  // Retrieve puzzles by category and optional difficulty
  async getPuzzlesByCategory(
    category: string,
    difficulty?: PuzzleDifficulty,
  ): Promise<Puzzle[]> {
    const query = this.puzzleRepository
      .createQueryBuilder('puzzle')
      .andWhere('puzzle.category = :category', { category });

    if (difficulty) {
      query.andWhere('puzzle.difficulty = :difficulty', { difficulty });
    }

    return query.getMany();
  }

  // Calculate category statistics
  async getCategoryStatistics(): Promise<
    { category: string; count: number }[]
  > {
    return this.puzzleRepository
      .createQueryBuilder('puzzle')
      .select('puzzle.category', 'category')
      .addSelect('COUNT(puzzle.id)', 'count')
      .groupBy('puzzle.category')
      .getRawMany();
  }
}
