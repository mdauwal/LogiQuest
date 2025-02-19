/* eslint-disable prettier/prettier */
import { Controller, Get, Param, Patch, Body, Post } from '@nestjs/common';
import { ProgressService } from './progress.service';
import { ProgressResponseDto, UpdateProgressDto } from './dto/progress.dto';

@Controller('progress')
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @Get(':id')
  findOne(@Param('id') id: string): Promise<ProgressResponseDto> {
    return this.progressService.findOne(+id);
  }

  @Get()
  getUserProgress(@Body('userId') userId: string) {
    return this.progressService.getUserProgress(userId);
  }

  @Post('chains/:id')
  updateChainProgress(
    @Body('userId') userId: string,
    @Param('id') chainId: number,
    @Body() body: { status: string },
  ) {
    return this.progressService.updateChainProgress(
      userId,
      chainId,
      body.status,
    );
  }
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProgressDto: UpdateProgressDto,
  ): Promise<ProgressResponseDto> {
    return this.progressService.update(+id, updateProgressDto);
  }
}
