import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { AccountsModule } from './accounts/accounts.module.js';
import { TransactionsModule } from './transactions/transactions.module.js';
import { GoalsModule } from './goals/goals.module.js';
import { LoansModule } from './loans/loans.module.js';

@Module({
  imports: [
    PrismaModule,
    AccountsModule,
    TransactionsModule,
    GoalsModule,
    LoansModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
