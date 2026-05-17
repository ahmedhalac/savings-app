import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service.js';
import { DepositDto } from './dto/deposit.dto.js';
import { WithdrawDto } from './dto/withdraw.dto.js';

@Controller('accounts/:id')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post('deposit')
  deposit(@Param('id', ParseIntPipe) id: number, @Body() dto: DepositDto) {
    return this.transactionsService.deposit(id, dto.amount);
  }

  @Post('withdraw')
  withdraw(@Param('id', ParseIntPipe) id: number, @Body() dto: WithdrawDto) {
    return this.transactionsService.withdraw(id, dto.amount, dto.note);
  }

  @Get('transactions')
  findByAccount(@Param('id', ParseIntPipe) id: number) {
    return this.transactionsService.findByAccount(id);
  }
}
