import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class LoansService {
  constructor(private readonly prisma: PrismaService) {}

  create(borrowerName: string, amount: number, userId: string) {
    return this.prisma.loan.create({ data: { borrowerName, amount, userId } });
  }

  async findAll(userId: string) {
    const loans = await this.prisma.loan.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    const totalLoaned = loans.reduce((sum, l) => sum + Number(l.amount), 0);
    return { loans, totalLoaned };
  }

  async delete(id: number, userId: string) {
    const loan = await this.prisma.loan.findFirst({ where: { id, userId } });
    if (!loan) throw new NotFoundException('Loan not found');
    return this.prisma.loan.delete({ where: { id } });
  }
}
