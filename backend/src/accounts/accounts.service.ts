import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateAccountDto } from './dto/create-account.dto.js';

@Injectable()
export class AccountsService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateAccountDto) {
    return this.prisma.account.create({ data: { name: dto.name, type: dto.type } });
  }

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

  async delete(id: number) {
    await this.prisma.$transaction([
      this.prisma.goal.deleteMany({ where: { accountId: id } }),
      this.prisma.transaction.deleteMany({ where: { accountId: id } }),
      this.prisma.account.delete({ where: { id } }),
    ]);
  }
}
