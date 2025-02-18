import { Controller, Get, Param, Patch, Body } from '@nestjs/common';
import { ProgressService } from './progress.service';
import { ProgressResponseDto, UpdateProgressDto } from './dto/progress.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('progress')
@Controller('progress')
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get progress by ID' })
  @ApiParam({ name: 'id', type: 'number', description: 'The ID of the progress entry' })
  @ApiResponse({ status: 200, description: 'Progress data retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Progress entry not found' })
  findOne(@Param('id') id: string): Promise<ProgressResponseDto> {
    return this.progressService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update progress by ID' })
  @ApiParam({ name: 'id', type: 'number', description: 'The ID of the progress entry' })
  @ApiResponse({ status: 200, description: 'Progress updated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid update request' })
  @ApiResponse({ status: 404, description: 'Progress entry not found' })
  update(
    @Param('id') id: string,
    @Body() updateProgressDto: UpdateProgressDto,
  ): Promise<ProgressResponseDto> {
    return this.progressService.update(+id, updateProgressDto);
  }
}
