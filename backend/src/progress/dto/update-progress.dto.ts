/* eslint-disable prettier/prettier */
import { IsNumber, IsBoolean, IsOptional, Min, Max } from 'class-validator';

export class UpdateProgressDto {
  @IsNumber()
  @Min(0)
  currentStep: number;

  @IsBoolean()
  @IsOptional()
  completed?: boolean;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(100)
  score?: number;
}