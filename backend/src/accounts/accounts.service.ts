import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class AccountsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.account.findMany({
      orderBy: { createdAt: 'asc' },
    });
  }

  async getSummary() {
    const accounts = await this.prisma.account.findMany();
    const total = accounts.reduce((sum, a) => sum + Number(a.balance), 0);
    return { totalBalance: total };
  }
}
