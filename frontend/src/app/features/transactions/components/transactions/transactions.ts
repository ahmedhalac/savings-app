import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { DatePipe, DecimalPipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AccountsService } from '../../../accounts/services/accounts.service';
import { TransactionsService } from '../../services/transactions.service';
import { Account } from '../../../../models/account';
import { Transaction } from '../../../../models/transaction';

type Tab = 'deposit' | 'withdraw';
type Status = 'idle' | 'loading' | 'success' | 'error';

@Component({
  selector: 'app-transactions',
  imports: [ReactiveFormsModule, DecimalPipe, DatePipe],
  templateUrl: './transactions.html',
  styleUrl: './transactions.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionsComponent {
  private accountsService = inject(AccountsService);
  private transactionsService = inject(TransactionsService);
  private fb = inject(FormBuilder);

  accounts = toSignal(this.accountsService.getAll(), { initialValue: [] as Account[] });

  activeTab = signal<Tab>('deposit');
  selectedAccountId = signal<number | null>(null);
  transactions = signal<Transaction[]>([]);
  submitStatus = signal<Status>('idle');
  errorMessage = signal('');

  depositForm = this.fb.group({
    accountId: [null as number | null, Validators.required],
    amount: [null as number | null, [Validators.required, Validators.min(0.01)]],
  });

  withdrawForm = this.fb.group({
    accountId: [null as number | null, Validators.required],
    amount: [null as number | null, [Validators.required, Validators.min(0.01)]],
    note: ['', [Validators.required, Validators.minLength(1)]],
  });

  setTab(tab: Tab) {
    this.activeTab.set(tab);
    this.submitStatus.set('idle');
    this.errorMessage.set('');
  }

  onSelectHistoryAccount(event: Event) {
    const raw = (event.target as HTMLSelectElement).value;
    const id = raw ? +raw : null;
    this.selectedAccountId.set(id);
    if (id) {
      this.transactionsService.getByAccount(id).subscribe(txs => this.transactions.set(txs));
    } else {
      this.transactions.set([]);
    }
  }

  submitDeposit() {
    if (this.depositForm.invalid) return;
    const { accountId, amount } = this.depositForm.value;
    this.submitStatus.set('loading');
    this.transactionsService.deposit(accountId as number, amount as number).subscribe({
      next: () => {
        this.submitStatus.set('success');
        this.depositForm.reset();
        this.refreshHistoryIfMatch(accountId as number);
      },
      error: (err) => {
        this.submitStatus.set('error');
        this.errorMessage.set(err.error?.message ?? 'Something went wrong');
      },
    });
  }

  submitWithdraw() {
    if (this.withdrawForm.invalid) return;
    const { accountId, amount, note } = this.withdrawForm.value;
    this.submitStatus.set('loading');
    this.transactionsService.withdraw(accountId as number, amount as number, note as string).subscribe({
      next: () => {
        this.submitStatus.set('success');
        this.withdrawForm.reset();
        this.refreshHistoryIfMatch(accountId as number);
      },
      error: (err) => {
        this.submitStatus.set('error');
        this.errorMessage.set(err.error?.message ?? 'Something went wrong');
      },
    });
  }

  private refreshHistoryIfMatch(accountId: number) {
    if (this.selectedAccountId() === accountId) {
      this.transactionsService.getByAccount(accountId).subscribe(txs => this.transactions.set(txs));
    }
  }
}
