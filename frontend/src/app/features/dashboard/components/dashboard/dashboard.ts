import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AccountsService } from '../../../accounts/services/accounts.service';
import { LoansService } from '../../../loans/services/loans.service';
import { Account } from '../../../../models/account';
import { I18nService } from '../../../../core/i18n/i18n.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs';

type AddStatus = 'idle' | 'loading' | 'error';

@Component({
  selector: 'app-dashboard',
  imports: [DecimalPipe, FormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit {
  private accountsService = inject(AccountsService);
  private loansService = inject(LoansService);
  private toastr = inject(ToastrService);

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

  netAvailable = computed(() => this.regularAccounts().reduce((sum, a) => sum + Number(a.balance), 0));
  totalLoaned = computed(() => this.loansData().totalLoaned);
  totalBalance = computed(() => this.netAvailable() + this.totalLoaned());

  // Add account modal
  showAddModal = signal(false);
  newName = signal('');
  newType = signal<'savings' | 'current'>('savings');
  addStatus = signal<AddStatus>('idle');

  // Add buffer modal
  showAddBufferModal = signal(false);
  newBufferName = signal('');
  addBufferStatus = signal<AddStatus>('idle');

  // Delete confirmation modal
  confirmDeleteAccount = signal<Account | null>(null);

  ngOnInit() {
    this.loadAccounts();
  }

  loadAccounts() {
    this.accountsService.getAll().subscribe(accounts => {
      this.accounts.set(accounts);
      this.accountsLoading.set(false);
    });
  }

  openAddModal() {
    this.newName.set('');
    this.newType.set('savings');
    this.addStatus.set('idle');
    this.showAddModal.set(true);
  }

  closeAddModal() {
    this.showAddModal.set(false);
  }

  submitAdd() {
    const name = this.newName().trim();
    if (!name || this.addStatus() === 'loading') return;
    this.addStatus.set('loading');
    this.accountsService.create({ name, type: this.newType() }).subscribe({
      next: () => {
        this.showAddModal.set(false);
        this.loadAccounts();
        this.toastr.success(this.t().dashboard.accountAdded);
      },
      error: (err) => {
        this.addStatus.set('error');
        this.toastr.error(err.error?.message ?? this.t().toast.error);
      },
    });
  }

  openAddBufferModal() {
    this.newBufferName.set('');
    this.addBufferStatus.set('idle');
    this.showAddBufferModal.set(true);
  }

  closeAddBufferModal() {
    this.showAddBufferModal.set(false);
  }

  submitAddBuffer() {
    const name = this.newBufferName().trim();
    if (!name || this.addBufferStatus() === 'loading') return;
    this.addBufferStatus.set('loading');
    this.accountsService.create({ name, type: 'buffer' }).subscribe({
      next: () => {
        this.showAddBufferModal.set(false);
        this.loadAccounts();
        this.toastr.success(this.t().dashboard.accountAdded);
      },
      error: (err) => {
        this.addBufferStatus.set('error');
        this.toastr.error(err.error?.message ?? this.t().toast.error);
      },
    });
  }

  requestDelete(account: Account) {
    this.confirmDeleteAccount.set(account);
  }

  cancelDelete() {
    this.confirmDeleteAccount.set(null);
  }

  confirmDelete() {
    const account = this.confirmDeleteAccount();
    if (!account) return;
    this.accountsService.delete(account.id).subscribe({
      next: () => {
        this.confirmDeleteAccount.set(null);
        this.loadAccounts();
        this.toastr.success(this.t().dashboard.accountDeleted);
      },
      error: (err) => {
        this.confirmDeleteAccount.set(null);
        this.toastr.error(err.error?.message ?? this.t().toast.error);
      },
    });
  }
}
