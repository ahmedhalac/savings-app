import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { Transaction } from '../../generated/prisma/client.js';

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

  async findAll() {
    const [goals, nonBufferAccounts] = await Promise.all([
      this.prisma.goal.findMany({ orderBy: { createdAt: 'desc' } }),
      this.prisma.account.findMany({
        where: { type: { not: 'buffer' } },
        include: { transactions: true },
      }),
    ]);

    const savedAmount = nonBufferAccounts.reduce(
      (sum, a) => sum + Number(a.balance),
      0,
    );
    const allTransactions = nonBufferAccounts.flatMap((a) => a.transactions);
    const avgMonthlyDeposit = this.calcAvgMonthlyDeposit(allTransactions);

    return goals.map((goal) => {
      const targetAmount = Number(goal.targetAmount);
      const percentComplete = Math.min(
        Math.round((savedAmount / targetAmount) * 1000) / 10,
        100,
      );

      let projectedCompletionDate: string | null = null;
      const remaining = targetAmount - savedAmount;
      if (remaining > 0 && avgMonthlyDeposit > 0) {
        const monthsToGo = remaining / avgMonthlyDeposit;
        const projected = new Date();
        projected.setDate(projected.getDate() + monthsToGo * 30.44);
        projectedCompletionDate = projected.toISOString();
      }

      return {
        id: goal.id,
        accountId: goal.accountId,
        name: goal.name,
        targetAmount: goal.targetAmount,
        deadline: goal.deadline,
        createdAt: goal.createdAt,
        savedAmount,
        percentComplete,
        avgMonthlyDeposit,
        projectedCompletionDate,
      };
    });
  }

  private calcAvgMonthlyDeposit(transactions: Transaction[]): number {
    const deposits = transactions.filter((t) => t.type === 'deposit');
    if (deposits.length === 0) return 0;

    const monthTotals = new Map<string, number>();
    for (const t of deposits) {
      const key = `${t.createdAt.getFullYear()}-${t.createdAt.getMonth()}`;
      monthTotals.set(key, (monthTotals.get(key) ?? 0) + Number(t.amount));
    }

    const total = [...monthTotals.values()].reduce((a, b) => a + b, 0);
    return total / monthTotals.size;
  }

  async delete(id: number) {
    const goal = await this.prisma.goal.findUnique({ where: { id } });
    if (!goal) throw new NotFoundException('Goal not found');
    return this.prisma.goal.delete({ where: { id } });
  }
}
