import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class TransactionsService {
  constructor(private readonly prisma: PrismaService) {}

  async deposit(accountId: number, amount: number, userId: string) {
    const account = await this.prisma.appAccount.findFirst({
      where: { id: accountId, userId },
    });
    if (!account) throw new NotFoundException('Account not found');

    const [transaction] = await this.prisma.$transaction([
      this.prisma.transaction.create({
        data: { accountId, type: 'deposit', amount },
      }),
      this.prisma.appAccount.update({
        where: { id: accountId },
        data: { balance: { increment: amount } },
      }),
    ]);
    return transaction;
  }

  async withdraw(accountId: number, amount: number, note: string, userId: string) {
    if (!note || !note.trim())
      throw new BadRequestException('note is required for withdrawals');

    const account = await this.prisma.appAccount.findFirst({
      where: { id: accountId, userId },
    });
    if (!account) throw new NotFoundException('Account not found');
    if (Number(account.balance) < amount)
      throw new BadRequestException('Insufficient balance');

    const [transaction] = await this.prisma.$transaction([
      this.prisma.transaction.create({
        data: { accountId, type: 'withdrawal', amount, note },
      }),
      this.prisma.appAccount.update({
        where: { id: accountId },
        data: { balance: { decrement: amount } },
      }),
    ]);
    return transaction;
  }

  async findByAccount(accountId: number, userId: string) {
    const account = await this.prisma.appAccount.findFirst({
      where: { id: accountId, userId },
    });
    if (!account) throw new NotFoundException('Account not found');
    return this.prisma.transaction.findMany({
      where: { accountId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
