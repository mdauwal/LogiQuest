import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PuzzlesModule } from './puzzles/puzzles.module';
import { StepsModule } from './steps/steps.module';
import { GameSessionsModule } from './game-sessions/game-sessions.module';
import { AchievementsModule } from './achievements/achievements.module';
import { AuthModule } from './auth/auth.module';
import { ProgressModule } from './progress/progress.module';
import { ChainModule } from './chain/chain.module';
import { DatabaseModule } from './database/database.module';
import { validateConfig } from './config/config.validation';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,

      // Set the correct path for your environment file if needed
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres', // Change this based on your database (mysql, sqlite, etc.)
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 5433,
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'funbi',
      database: process.env.DB_NAME || 'logiquest',
      autoLoadEntities: true, // Auto-loads entities so you don't have to manually add them
      synchronize: true, // Set to false in production

      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
      validate: validateConfig, // Load environment variables
    }),
    UsersModule,
    PuzzlesModule,
    StepsModule,
    GameSessionsModule,
    AchievementsModule,
    AuthModule,
    ProgressModule,
    ChainModule,
    DatabaseModule, // ✅ Correctly placed inside imports array
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
