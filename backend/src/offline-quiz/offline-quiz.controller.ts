import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OfflineQuizService } from './offline-quiz.service';
import { CreateOfflineQuizDto } from './dto/create-offline-quiz.dto';
import { UpdateOfflineQuizDto } from './dto/update-offline-quiz.dto';

@Controller('offline-quiz')
export class OfflineQuizController {
  constructor(private readonly offlineQuizService: OfflineQuizService) {}

  @Post()
  create(@Body() createOfflineQuizDto: CreateOfflineQuizDto) {
    return this.offlineQuizService.create(createOfflineQuizDto);
  }

  @Get()
  findAll() {
    return this.offlineQuizService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.offlineQuizService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOfflineQuizDto: UpdateOfflineQuizDto) {
    return this.offlineQuizService.update(+id, updateOfflineQuizDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.offlineQuizService.remove(+id);
  }
}
