import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { GoalsService } from './goals.service.js';

@Controller('goals')
export class GoalsController {
  constructor(private readonly goalsService: GoalsService) {}

  @Post()
  create(
    @Body()
    body: {
      accountId: number;
      name: string;
      target_amount: number;
      deadline?: string;
    },
  ) {
    return this.goalsService.create(
      body.accountId,
      body.name,
      body.target_amount,
      body.deadline,
    );
  }

  @Get()
  findAll() {
    return this.goalsService.findAll();
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.goalsService.delete(id);
  }
}
