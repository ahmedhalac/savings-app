import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateAccountDto } from './dto/create-account.dto.js';

@Injectable()
export class AccountsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateAccountDto) {
    if (dto.type === 'buffer') {
      const existing = await this.prisma.appAccount.findFirst({ where: { type: 'buffer' } });
      if (existing) throw new ConflictException('A Buffer account already exists');
    }
    return this.prisma.appAccount.create({ data: { name: dto.name, type: dto.type } });
  }

  findAll() {
    return this.prisma.appAccount.findMany({
      orderBy: { createdAt: 'asc' },
    });
  }

  async getSummary() {
    const accounts = await this.prisma.appAccount.findMany({
      where: { type: { not: 'buffer' } },
    });
    const total = accounts.reduce((sum, a) => sum + Number(a.balance), 0);
    return { totalBalance: total };
  }

  async delete(id: number) {
    await this.prisma.$transaction([
      this.prisma.transaction.deleteMany({ where: { accountId: id } }),
      this.prisma.appAccount.delete({ where: { id } }),
    ]);
  }
}
