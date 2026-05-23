import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { Session } from '@thallesp/nestjs-better-auth';
import type { UserSession } from '@thallesp/nestjs-better-auth';
import { AccountsService } from './accounts.service.js';
import { CreateAccountDto } from './dto/create-account.dto.js';
import { auth } from '../auth/auth.js';

@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Post()
  create(@Body() dto: CreateAccountDto, @Session() session: UserSession<typeof auth>) {
    return this.accountsService.create(dto, session.user.id);
  }

  @Get()
  findAll(@Session() session: UserSession<typeof auth>) {
    return this.accountsService.findAll(session.user.id);
  }

  @Get('summary')
  getSummary(@Session() session: UserSession<typeof auth>) {
    return this.accountsService.getSummary(session.user.id);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number, @Session() session: UserSession<typeof auth>) {
    return this.accountsService.delete(id, session.user.id);
  }
}
