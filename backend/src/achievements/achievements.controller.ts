import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AchievementsService } from './achievements.service';
import { CreateAchievementDto } from './dto/create-achievement.dto';
import { UpdateAchievementDto } from './dto/update-achievement.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger'; // Importing Swagger decorators

@ApiTags('Achievements') // Grouping under "Achievements" tag
@Controller('achievements')
export class AchievementsController {
  constructor(private readonly achievementsService: AchievementsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new achievement' })
  @ApiBody({ type: CreateAchievementDto }) // Describes the body for the 'create' endpoint
  @ApiResponse({ status: 201, description: 'Achievement successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad request, invalid data.' })
  create(@Body() createAchievementDto: CreateAchievementDto) {
    return this.achievementsService.create(createAchievementDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all achievements' })
  @ApiResponse({
    status: 200,
    description: 'List of achievements',
    isArray: true, // Indicates this returns an array of achievements
  })
  findAll() {
    return this.achievementsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an achievement by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the achievement' }) // Describes the parameter 'id'
  @ApiResponse({
    status: 200,
    description: 'Achievement details',
  })
  @ApiResponse({
    status: 404,
    description: 'Achievement not found',
  })
  findOne(@Param('id') id: string) {
    return this.achievementsService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an achievement' })
  @ApiParam({ name: 'id', description: 'The ID of the achievement to update' }) // Describes the parameter 'id'
  @ApiBody({ type: UpdateAchievementDto }) // Describes the body for the 'update' endpoint
  @ApiResponse({
    status: 200,
    description: 'Achievement successfully updated',
  })
  @ApiResponse({
    status: 404,
    description: 'Achievement not found',
  })
  update(
    @Param('id') id: string,
    @Body() updateAchievementDto: UpdateAchievementDto,
  ) {
    return this.achievementsService.update(+id, updateAchievementDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an achievement' })
  @ApiParam({ name: 'id', description: 'The ID of the achievement to delete' }) // Describes the parameter 'id'
  @ApiResponse({
    status: 200,
    description: 'Achievement successfully deleted',
  })
  @ApiResponse({
    status: 404,
    description: 'Achievement not found',
  })
  remove(@Param('id') id: string) {
    return this.achievementsService.remove(+id);
  }
}
