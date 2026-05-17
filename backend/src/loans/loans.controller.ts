import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { LoansService } from './loans.service.js';

@Controller('loans')
export class LoansController {
  constructor(private readonly loansService: LoansService) {}

  @Post()
  create(@Body() body: { borrower_name: string; amount: number }) {
    return this.loansService.create(body.borrower_name, body.amount);
  }

  @Get()
  findAll() {
    return this.loansService.findAll();
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.loansService.delete(id);
  }
}
