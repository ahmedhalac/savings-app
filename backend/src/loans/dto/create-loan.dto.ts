import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateLoanDto {
  @IsString()
  @IsNotEmpty()
  borrowerName!: string;

  @IsNumber()
  @Min(0.01)
  amount!: number;
}
