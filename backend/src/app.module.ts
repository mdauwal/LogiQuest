import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PuzzlesModule } from './puzzles/puzzles.module';
import { StepsModule } from './steps/steps.module';
import { GameSessionsModule } from './game-sessions/game-sessions.module';
import { AchievementsModule } from './achievements/achievements.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ProgressModule } from './progress/progress.module';
import { ChainModule } from './chain/chain.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.test']
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory:( configService:ConfigService ) => ({
        type: 'postgres',
        url: configService.get<string>('DATABASE_URL'),
        synchronize: true, // Set to false during  production
        autoLoadEntities: true,
        ssl: false, 
      })
    }),
    UsersModule,
    PuzzlesModule,
    StepsModule,
    GameSessionsModule,
    AchievementsModule,
    AuthModule,
    ProgressModule,
    ChainModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
