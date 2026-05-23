import { join } from 'path';
import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { AccountsModule } from './accounts/accounts.module.js';
import { TransactionsModule } from './transactions/transactions.module.js';
import { GoalsModule } from './goals/goals.module.js';
import { LoansModule } from './loans/loans.module.js';
import { AuthModule } from './auth/auth.module.js';

@Module({
  imports: [
    AuthModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', '..', 'frontend', 'dist', 'frontend', 'browser'),
      exclude: ['/api/{*path}'],
    }),
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
