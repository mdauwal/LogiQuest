import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LifelineService } from './lifeline.service';
import { GameSession } from '../game-sessions/entities/game-session.entity';
import { LifelineController } from './lifeline.controller';
import { Puzzle } from 'src/puzzles/entities/puzzle.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GameSession, Puzzle])],
  providers: [LifelineService],
  controllers: [LifelineController],
  exports: [LifelineService],
})
export class LifelineModule {}
