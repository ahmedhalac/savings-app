import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { AccountsService } from './accounts.service.js';
import { CreateAccountDto } from './dto/create-account.dto.js';

@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Post()
  create(@Body() dto: CreateAccountDto) {
    return this.accountsService.create(dto);
  }

  @Get()
  findAll() {
    return this.accountsService.findAll();
  }

  @Get('summary')
  getSummary() {
    return this.accountsService.getSummary();
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.accountsService.delete(id);
  }
}
