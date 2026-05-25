import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AccountsService } from '../../../accounts/services/accounts.service';
import { LoansService } from '../../../loans/services/loans.service';
import { Account } from '../../../../models/account';
import { I18nService } from '../../../../core/i18n/i18n.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  imports: [DecimalPipe, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit {
  private accountsService = inject(AccountsService);
  private loansService = inject(LoansService);

  readonly t = inject(I18nService).t;

  accounts = signal<Account[]>([]);
  accountsLoading = signal(true);
  loansLoading = signal(true);
  loansData = toSignal(
    this.loansService.getAll().pipe(tap(() => this.loansLoading.set(false))),
    { initialValue: { loans: [], totalLoaned: 0 } }
  );

  pageLoading = computed(() => this.accountsLoading() || this.loansLoading());
  regularAccounts = computed(() => this.accounts().filter(a => a.type !== 'buffer'));
  bufferAccount = computed(() => this.accounts().find(a => a.type === 'buffer') ?? null);

  accountsBalance = computed(() => this.regularAccounts().reduce((sum, a) => sum + Number(a.balance), 0));
  totalLoaned = computed(() => this.loansData().totalLoaned);
  totalBalance = computed(() => this.accountsBalance() + this.totalLoaned());
  netAvailable = computed(() => this.accountsBalance());

  showBufferInfo = signal(false);

  ngOnInit() {
    this.accountsService.getAll().subscribe(accounts => {
      this.accounts.set(accounts);
      this.accountsLoading.set(false);
    });
  }
}
