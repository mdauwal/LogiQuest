import { Module } from '@nestjs/common';
import { PuzzlesService } from './puzzles.service';
import { PuzzlesController } from './puzzles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Puzzle } from './entities/puzzle.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Puzzle])],
  controllers: [PuzzlesController],
  providers: [PuzzlesService],
  exports: [PuzzlesService]
})
export class PuzzlesModule {}