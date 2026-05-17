import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class WithdrawDto {
  @IsNumber()
  @Min(0.01)
  amount!: number;

  @IsString()
  @IsNotEmpty()
  note!: string;
}
