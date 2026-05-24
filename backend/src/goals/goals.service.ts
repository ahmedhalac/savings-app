import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

type AccountWithTransactions = {
  createdAt: Date;
  balance: { valueOf(): string };
  transactions: { type: string; amount: { valueOf(): string }; createdAt: Date }[];
};

@Injectable()
export class GoalsService {
  constructor(private readonly prisma: PrismaService) {}

  create(name: string, targetAmount: number, userId: string, deadline?: string) {
    return this.prisma.goal.create({
      data: {
        name,
        targetAmount,
        userId,
        deadline: deadline ? new Date(deadline) : null,
      },
    });
  }

  async findAll(userId: string) {
    const [goals, nonBufferAccounts, loans] = await Promise.all([
      this.prisma.goal.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } }),
      this.prisma.appAccount.findMany({
        where: { type: { not: 'buffer' }, userId },
        include: { transactions: true },
      }),
      this.prisma.loan.findMany({ where: { userId } }),
    ]);

    const accountsBalance = nonBufferAccounts.reduce(
      (sum, a) => sum + Number(a.balance),
      0,
    );
    const totalLoaned = loans.reduce((sum, l) => sum + Number(l.amount), 0);
    const savedAmount = accountsBalance + totalLoaned;
    const avgMonthlyDeposit = this.calcAvgMonthlyDeposit(nonBufferAccounts);

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
        name: goal.name,
        targetAmount: goal.targetAmount,
        deadline: goal.deadline,
        createdAt: goal.createdAt,
        savedAmount,
        percentComplete,
        projectedCompletionDate,
      };
    });
  }

  // All-time average monthly deposit across all non-buffer accounts.
  // Skips only the earliest deposit per account in its creation month (initial funding).
  // Includes the current month so new users see a projection immediately.
  // Divides by the full date range (including quiet months) to keep projections conservative.
  private calcAvgMonthlyDeposit(accounts: AccountWithTransactions[]): number {
    const now = new Date();
    const monthTotals = new Map<string, number>();

    for (const account of accounts) {
      const setupKey = `${account.createdAt.getFullYear()}-${account.createdAt.getMonth()}`;

      // Find the earliest deposit in the setup month — that's the initial funding to skip
      const earliestSetupMs = account.transactions
        .filter((t) => {
          const k = `${t.createdAt.getFullYear()}-${t.createdAt.getMonth()}`;
          return t.type === 'deposit' && k === setupKey;
        })
        .reduce((min, t) => Math.min(min, t.createdAt.getTime()), Infinity);

      for (const t of account.transactions) {
        if (t.type !== 'deposit') continue;
        if (t.createdAt.getTime() === earliestSetupMs) continue; // skip initial funding only
        const key = `${t.createdAt.getFullYear()}-${t.createdAt.getMonth()}`;
        monthTotals.set(key, (monthTotals.get(key) ?? 0) + Number(t.amount));
      }
    }

    if (monthTotals.size === 0) return 0;

    // Range: first month with a qualifying deposit → current month (inclusive)
    const sortedKeys = [...monthTotals.keys()].sort();
    const [firstYear, firstMonthIdx] = sortedKeys[0].split('-').map(Number);
    const rangeEnd = new Date(now.getFullYear(), now.getMonth(), 1);

    let totalMonths = 0;
    const cursor = new Date(firstYear, firstMonthIdx, 1);
    while (cursor <= rangeEnd) {
      totalMonths++;
      cursor.setMonth(cursor.getMonth() + 1);
    }

    if (totalMonths === 0) return 0;

    const total = [...monthTotals.values()].reduce((a, b) => a + b, 0);
    return total / totalMonths;
  }

  async delete(id: number, userId: string) {
    const goal = await this.prisma.goal.findFirst({ where: { id, userId } });
    if (!goal) throw new NotFoundException('Goal not found');
    return this.prisma.goal.delete({ where: { id } });
  }
}
