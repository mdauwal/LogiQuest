import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { GameSessionsService } from './game-sessions.service';
import { CreateGameSessionDto } from './dto/create-game-session.dto';
import { UpdateGameSessionDto } from './dto/update-game-session.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('game-sessions')
@Controller('game-sessions')
export class GameSessionsController {
  constructor(private readonly gameSessionsService: GameSessionsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new game session' })
  @ApiResponse({ status: 201, description: 'Game session successfully created' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  create(@Body() createGameSessionDto: CreateGameSessionDto) {
    return this.gameSessionsService.create(createGameSessionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all game sessions' })
  @ApiResponse({ status: 200, description: 'Returns all game sessions' })
  findAll() {
    return this.gameSessionsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a game session by ID' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID of the game session' })
  @ApiResponse({ status: 200, description: 'Returns the game session' })
  @ApiResponse({ status: 404, description: 'Game session not found' })
  findOne(@Param('id') id: string) {
    return this.gameSessionsService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a game session' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID of the game session' })
  @ApiResponse({ status: 200, description: 'Game session successfully updated' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 404, description: 'Game session not found' })
  update(@Param('id') id: string, @Body() updateGameSessionDto: UpdateGameSessionDto) {
    return this.gameSessionsService.update(+id, updateGameSessionDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a game session' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID of the game session' })
  @ApiResponse({ status: 200, description: 'Game session successfully deleted' })
  @ApiResponse({ status: 404, description: 'Game session not found' })
  remove(@Param('id') id: string) {
    return this.gameSessionsService.remove(+id);
  }
}
