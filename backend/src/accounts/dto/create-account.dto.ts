import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export class CreateAccountDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsIn(['savings', 'current', 'buffer'])
  type!: 'savings' | 'current' | 'buffer';
}
