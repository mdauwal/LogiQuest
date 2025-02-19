import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from "@nestjs/common"
import type { GameSessionsService } from "./game-sessions.service"
import type { CreateGameSessionDto } from "./dto/create-game-session.dto"
import type { UpdateGameSessionDto } from "./dto/update-game-session.dto"

@Controller("game-sessions")
export class GameSessionsController {
  constructor(private readonly gameSessionsService: GameSessionsService) {}

  @Post()
  create(@Body() createGameSessionDto: CreateGameSessionDto, @Request() req) {
    createGameSessionDto.userId = req.user.id
    return this.gameSessionsService.create(createGameSessionDto)
  }

  @Get()
  findAll() {
    return this.gameSessionsService.findAll()
  }

  @Get('active')
  findActive(@Request() req) {
    return this.gameSessionsService.findActiveByUser(req.user.id);
  }

  @Get('history')
  getSessionHistory(@Request() req) {
    return this.gameSessionsService.getSessionHistory(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.gameSessionsService.findOne(+id);
  }

  @Patch(":id")
  update(@Param('id') id: string, @Body() updateGameSessionDto: UpdateGameSessionDto) {
    return this.gameSessionsService.update(+id, updateGameSessionDto)
  }

  @Post(':id/complete')
  completeSession(@Param('id') id: string) {
    return this.gameSessionsService.completeSession(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.gameSessionsService.remove(+id);
  }
}

