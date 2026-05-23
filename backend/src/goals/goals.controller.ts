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
import { GoalsService } from './goals.service.js';
import { CreateGoalDto } from './dto/create-goal.dto.js';
import { auth } from '../auth/auth.js';

@Controller('goals')
export class GoalsController {
  constructor(private readonly goalsService: GoalsService) {}

  @Post()
  create(@Body() dto: CreateGoalDto, @Session() session: UserSession<typeof auth>) {
    return this.goalsService.create(dto.name, dto.targetAmount, session.user.id, dto.deadline);
  }

  @Get()
  findAll(@Session() session: UserSession<typeof auth>) {
    return this.goalsService.findAll(session.user.id);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number, @Session() session: UserSession<typeof auth>) {
    return this.goalsService.delete(id, session.user.id);
  }
}
