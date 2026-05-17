import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service.js';

@Controller('accounts/:id')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post('deposit')
  deposit(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { amount: number },
  ) {
    return this.transactionsService.deposit(id, body.amount);
  }

  @Post('withdraw')
  withdraw(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { amount: number; note: string },
  ) {
    return this.transactionsService.withdraw(id, body.amount, body.note);
  }

  @Get('transactions')
  findByAccount(@Param('id', ParseIntPipe) id: number) {
    return this.transactionsService.findByAccount(id);
  }
}
