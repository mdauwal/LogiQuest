import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StepsService } from './steps.service';
import { StepsController } from './steps.controller';
import { Step } from './entities/step.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Step])],
  controllers: [StepsController],
  providers: [StepsService],
  exports: [TypeOrmModule], 
})
export class StepsModule {}