import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PuzzlesService } from './puzzles.service';
import { CreatePuzzleDto } from './dto/create-puzzle.dto';
import { UpdatePuzzleDto } from './dto/update-puzzle.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('puzzles')
@Controller('puzzles')
export class PuzzlesController {
  constructor(private readonly puzzlesService: PuzzlesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new puzzle' })
  @ApiResponse({ status: 201, description: 'The puzzle has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  create(@Body() createPuzzleDto: CreatePuzzleDto) {
    return this.puzzlesService.create(createPuzzleDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all puzzles' })
  @ApiResponse({ status: 200, description: 'Return all puzzles.' })
  findAll() {
    return this.puzzlesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a puzzle by id' })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiResponse({ status: 200, description: 'Return the puzzle.' })
  @ApiResponse({ status: 404, description: 'Puzzle not found.' })
  findOne(@Param('id') id: string) {
    return this.puzzlesService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a puzzle' })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiResponse({ status: 200, description: 'The puzzle has been successfully updated.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 404, description: 'Puzzle not found.' })
  update(@Param('id') id: string, @Body() updatePuzzleDto: UpdatePuzzleDto) {
    return this.puzzlesService.update(+id, updatePuzzleDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a puzzle' })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiResponse({ status: 200, description: 'The puzzle has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Puzzle not found.' })
  remove(@Param('id') id: string) {
    return this.puzzlesService.remove(+id);
  }
}
