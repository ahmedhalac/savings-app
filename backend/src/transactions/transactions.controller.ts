import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { Session } from '@thallesp/nestjs-better-auth';
import type { UserSession } from '@thallesp/nestjs-better-auth';
import { TransactionsService } from './transactions.service.js';
import { DepositDto } from './dto/deposit.dto.js';
import { WithdrawDto } from './dto/withdraw.dto.js';
import { auth } from '../auth/auth.js';

@Controller('accounts/:id')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post('deposit')
  deposit(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: DepositDto,
    @Session() session: UserSession<typeof auth>,
  ) {
    return this.transactionsService.deposit(id, dto.amount, session.user.id);
  }

  @Post('withdraw')
  withdraw(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: WithdrawDto,
    @Session() session: UserSession<typeof auth>,
  ) {
    return this.transactionsService.withdraw(id, dto.amount, dto.note, session.user.id);
  }

  @Get('transactions')
  findByAccount(
    @Param('id', ParseIntPipe) id: number,
    @Session() session: UserSession<typeof auth>,
  ) {
    return this.transactionsService.findByAccount(id, session.user.id);
  }
}
