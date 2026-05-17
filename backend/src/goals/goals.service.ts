import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class GoalsService {
  constructor(private readonly prisma: PrismaService) {}

  create(
    accountId: number,
    name: string,
    targetAmount: number,
    deadline?: string,
  ) {
    return this.prisma.goal.create({
      data: {
        accountId,
        name,
        targetAmount,
        deadline: deadline ? new Date(deadline) : null,
      },
    });
  }

  findAll() {
    return this.prisma.goal.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async delete(id: number) {
    const goal = await this.prisma.goal.findUnique({ where: { id } });
    if (!goal) throw new NotFoundException('Goal not found');
    return this.prisma.goal.delete({ where: { id } });
  }
}
