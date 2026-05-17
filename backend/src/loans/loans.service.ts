import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class LoansService {
  constructor(private readonly prisma: PrismaService) {}

  create(borrowerName: string, amount: number) {
    return this.prisma.loan.create({ data: { borrowerName, amount } });
  }

  async findAll() {
    const loans = await this.prisma.loan.findMany({
      orderBy: { createdAt: 'desc' },
    });
    const totalLoaned = loans.reduce((sum, l) => sum + Number(l.amount), 0);
    return { loans, totalLoaned };
  }

  async delete(id: number) {
    const loan = await this.prisma.loan.findUnique({ where: { id } });
    if (!loan) throw new NotFoundException('Loan not found');
    return this.prisma.loan.delete({ where: { id } });
  }
}
