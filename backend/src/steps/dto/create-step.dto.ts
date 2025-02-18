import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsArray } from 'class-validator';

export class CreateStepDto {
  @ApiProperty({
    description: 'The description of the step',
    example: 'Solve this equation: 3x + 2 = 5'
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'The order of the step in the LogiQuest',
    example: 1
  })
  @IsNumber()
  order: number;

  @ApiProperty({
    description: 'The hints for solving the step',
    example: ['Divide both sides by 2', 'Multiply both sides by 3']
  })
  @IsArray()
  @IsString({ each: true })
  hints: string[];
}
