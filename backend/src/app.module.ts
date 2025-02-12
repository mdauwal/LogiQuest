import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PuzzlesModule } from './puzzles/puzzles.module';
import { StepsModule } from './steps/steps.module';
import { GameSessionsModule } from './game-sessions/game-sessions.module';
import { AchievementsModule } from './achievements/achievements.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    UsersModule,
    PuzzlesModule,
    StepsModule,
    GameSessionsModule,
    AchievementsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
