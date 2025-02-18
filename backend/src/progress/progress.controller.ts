/* eslint-disable prettier/prettier */
import { Controller, Get, Param, Patch, Body } from '@nestjs/common';
import { ProgressService } from './progress.service';
import { ProgressResponseDto, UpdateProgressDto } from './dto/progress.dto';

@Controller('progress')
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @Get(':id')
  findOne(@Param('id') id: string): Promise<ProgressResponseDto> {
    return this.progressService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProgressDto: UpdateProgressDto,
  ): Promise<ProgressResponseDto> {
    const userId = 1; // Replace this with actual user logic (e.g., from a JWT token or session)
    return this.progressService.update(userId, +id, updateProgressDto);
  }
}
