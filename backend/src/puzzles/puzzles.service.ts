import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Puzzle } from './entities/puzzle.entity';
import { CreatePuzzleDto } from './dto/create-puzzle.dto';
import { UpdatePuzzleDto } from './dto/update-puzzle.dto';

@Injectable()
export class PuzzlesService {
  constructor(
    @InjectRepository(Puzzle)
    private readonly puzzleRepository: Repository<Puzzle>,
  ) {}

  // Create a new puzzle
  async create(createPuzzleDto: CreatePuzzleDto): Promise<Puzzle> {
    const puzzle = this.puzzleRepository.create(createPuzzleDto);
    return this.puzzleRepository.save(puzzle);
  }

  // Find all puzzles
  async findAll(): Promise<Puzzle[]> {
    return this.puzzleRepository.find();
  }

  // Find a puzzle by ID
  async findOne(id: number): Promise<Puzzle> {
    const puzzle = await this.puzzleRepository.findOne({ where: { id } });
    if (!puzzle) {
      throw new NotFoundException(`Puzzle with ID ${id} not found`);
    }
    return puzzle;
  }

  // Update a puzzle by ID
  async update(id: number, updatePuzzleDto: UpdatePuzzleDto): Promise<Puzzle> {
    const puzzle = await this.findOne(id); 
    Object.assign(puzzle, updatePuzzleDto); 
    return this.puzzleRepository.save(puzzle);
  }

  // Remove a puzzle by ID
  async remove(id: number): Promise<void> {
    const puzzle = await this.findOne(id); 
    await this.puzzleRepository.remove(puzzle);
  }
}