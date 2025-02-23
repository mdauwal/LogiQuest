import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { GameSessionsService } from "./game-sessions.service"
import { GameSessionsController } from "./game-sessions.controller"
import { GameSession } from "./entities/game-session.entity"
import { User } from "../users/entities/user.entity"
import { Chain } from "../chains/entities/chain.entity"
import { RedisConfigModule } from "src/redis/redis.module"

@Module({
  imports: [TypeOrmModule.forFeature([GameSession, User, Chain]), RedisConfigModule],
  controllers: [GameSessionsController],
  providers: [GameSessionsService],
  exports: [GameSessionsService],
})
export class GameSessionsModule {}

