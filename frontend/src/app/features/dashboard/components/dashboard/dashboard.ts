import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { CurrencyPipe } from '@angular/common';
import { AccountsService } from '../../../accounts/services/accounts.service';
import { LoansService } from '../../../loans/services/loans.service';
import { Account } from '../../../../models/account';

@Component({
  selector: 'app-dashboard',
  imports: [CurrencyPipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  private accountsService = inject(AccountsService);
  private loansService = inject(LoansService);

  accounts = toSignal(this.accountsService.getAll(), { initialValue: [] as Account[] });
  summary = toSignal(this.accountsService.getSummary(), { initialValue: { totalBalance: 0 } });
  loansData = toSignal(this.loansService.getAll(), { initialValue: { loans: [], totalLoaned: 0 } });

  totalBalance = computed(() => this.summary().totalBalance);
  totalLoaned = computed(() => this.loansData().totalLoaned);
  netBalance = computed(() => this.totalBalance() - this.totalLoaned());
}
