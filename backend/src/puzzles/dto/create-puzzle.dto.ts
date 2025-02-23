import {
  IsString,
  IsNumber,
  Min,
  Max,
  IsArray,
  ValidateNested,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateStepDto } from 'src/steps/dto/create-step.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePuzzleDto {
  @ApiProperty({
    type: 'string',
    description: 'The puzzle title',
    example: 'Math Problem',
  })
  @IsString()
  title: string;

  @ApiProperty({
    type: 'string',
    description: 'The puzzle description',
    example: 'Solve this math problem: 2 + 2 =?',
  })
  @IsString()
  description: string;

  @ApiProperty({
    type: 'number',
    description: 'The puzzle difficulty (1-5)',
    example: 3,
  })
  @IsNumber()
  @Min(1)
  @Max(5)
  difficulty: number;

  @ApiProperty({
    type: 'array',
    description: 'The puzzle steps',
    example: [
      {
        description: 'Add 2 to 2',
        order: 1,
        hints: ['2 + 2'],
      },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => CreateStepDto)
  steps: CreateStepDto[];
}
