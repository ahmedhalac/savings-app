import { IsDateString, IsNotEmpty, IsOptional, IsNumber, IsString, Min } from 'class-validator';

export class CreateGoalDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsNumber()
  @Min(0.01)
  targetAmount!: number;

  @IsOptional()
  @IsDateString()
  deadline?: string;
}
