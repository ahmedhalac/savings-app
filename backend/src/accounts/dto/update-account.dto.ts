import { IsIn, IsNumber, IsOptional, IsString, Min, MinLength } from 'class-validator';

export class UpdateAccountDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  name?: string;

  @IsOptional()
  @IsIn(['savings', 'current', 'buffer'])
  type?: 'savings' | 'current' | 'buffer';

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  balance?: number;
}
