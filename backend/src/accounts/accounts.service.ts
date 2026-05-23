import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateAccountDto } from './dto/create-account.dto.js';

@Injectable()
export class AccountsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateAccountDto, userId: string) {
    if (dto.type === 'buffer') {
      const existing = await this.prisma.appAccount.findFirst({ where: { type: 'buffer', userId } });
      if (existing) throw new ConflictException('A Buffer account already exists');
    }
    return this.prisma.appAccount.create({ data: { name: dto.name, type: dto.type, userId } });
  }

  findAll(userId: string) {
    return this.prisma.appAccount.findMany({
      where: { userId },
      orderBy: { createdAt: 'asc' },
    });
  }

  async getSummary(userId: string) {
    const accounts = await this.prisma.appAccount.findMany({
      where: { type: { not: 'buffer' }, userId },
    });
    const total = accounts.reduce((sum, a) => sum + Number(a.balance), 0);
    return { totalBalance: total };
  }

  async delete(id: number, userId: string) {
    const account = await this.prisma.appAccount.findFirst({ where: { id, userId } });
    if (!account) throw new NotFoundException('Account not found');
    await this.prisma.$transaction([
      this.prisma.transaction.deleteMany({ where: { accountId: id } }),
      this.prisma.appAccount.delete({ where: { id } }),
    ]);
  }
}
