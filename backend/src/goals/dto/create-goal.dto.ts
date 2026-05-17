import { IsDateString, IsInt, IsNotEmpty, IsOptional, IsNumber, IsString, Min } from 'class-validator';

export class CreateGoalDto {
  @IsInt()
  accountId!: number;

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
