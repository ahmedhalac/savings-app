import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { Session } from '@thallesp/nestjs-better-auth';
import type { UserSession } from '@thallesp/nestjs-better-auth';
import { LoansService } from './loans.service.js';
import { CreateLoanDto } from './dto/create-loan.dto.js';
import { auth } from '../auth/auth.js';

@Controller('loans')
export class LoansController {
  constructor(private readonly loansService: LoansService) {}

  @Post()
  create(@Body() dto: CreateLoanDto, @Session() session: UserSession<typeof auth>) {
    return this.loansService.create(dto.borrowerName, dto.amount, session.user.id);
  }

  @Get()
  findAll(@Session() session: UserSession<typeof auth>) {
    return this.loansService.findAll(session.user.id);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number, @Session() session: UserSession<typeof auth>) {
    return this.loansService.delete(id, session.user.id);
  }
}
