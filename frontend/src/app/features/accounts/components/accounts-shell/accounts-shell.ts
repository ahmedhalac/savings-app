import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AccountsService } from '../../services/accounts.service';
import { Account } from '../../../../models/account';
import { I18nService } from '../../../../core/i18n/i18n.service';

type AddStatus = 'idle' | 'loading' | 'error';

@Component({
  selector: 'app-accounts-shell',
  imports: [DecimalPipe, FormsModule],
  templateUrl: './accounts-shell.html',
  styleUrl: './accounts-shell.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountsShellComponent implements OnInit {
  private accountsService = inject(AccountsService);
  private toastr = inject(ToastrService);
  private router = inject(Router);

  readonly t = inject(I18nService).t;

  accounts = signal<Account[]>([]);
  accountsLoading = signal(true);

  regularAccounts = computed(() => this.accounts().filter(a => a.type !== 'buffer'));
  bufferAccount = computed(() => this.accounts().find(a => a.type === 'buffer') ?? null);

  showAddModal = signal(false);
  newName = signal('');
  newType = signal<'savings' | 'current'>('savings');
  addStatus = signal<AddStatus>('idle');

  showAddBufferModal = signal(false);
  newBufferName = signal('');
  addBufferStatus = signal<AddStatus>('idle');

  showBufferInfo = signal(false);

  editAccount = signal<Account | null>(null);
  editName = signal('');
  editType = signal<'savings' | 'current' | 'buffer'>('savings');
  editBalance = signal(0);
  editStatus = signal<AddStatus>('idle');

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

  closeAddModal() { this.showAddModal.set(false); }

  submitAdd() {
    const name = this.newName().trim();
    if (!name || this.addStatus() === 'loading') return;
    this.addStatus.set('loading');
    this.accountsService.create({ name, type: this.newType() }).subscribe({
      next: () => {
        this.showAddModal.set(false);
        this.loadAccounts();
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

  closeAddBufferModal() { this.showAddBufferModal.set(false); }

  submitAddBuffer() {
    const name = this.newBufferName().trim();
    if (!name || this.addBufferStatus() === 'loading') return;
    this.addBufferStatus.set('loading');
    this.accountsService.create({ name, type: 'buffer' }).subscribe({
      next: () => {
        this.showAddBufferModal.set(false);
        this.loadAccounts();
      },
      error: (err) => {
        this.addBufferStatus.set('error');
        this.toastr.error(err.error?.message ?? this.t().toast.error);
      },
    });
  }

  openEditModal(account: Account) {
    this.editAccount.set(account);
    this.editName.set(account.name);
    this.editType.set(account.type as 'savings' | 'current' | 'buffer');
    this.editBalance.set(Number(account.balance));
    this.editStatus.set('idle');
  }

  closeEditModal() { this.editAccount.set(null); }

  submitEdit() {
    const account = this.editAccount();
    if (!account) return;
    const name = this.editName().trim();
    if (!name || this.editStatus() === 'loading') return;
    this.editStatus.set('loading');
    this.accountsService.update(account.id, { name, type: this.editType(), balance: this.editBalance() }).subscribe({
      next: (updated) => {
        this.accounts.update(list => list.map(a => a.id === updated.id ? updated : a));
        this.editAccount.set(null);
      },
      error: (err) => {
        this.editStatus.set('error');
        this.toastr.error(err.error?.message ?? this.t().toast.error);
      },
    });
  }

  requestDelete(account: Account) { this.confirmDeleteAccount.set(account); }

  cancelDelete() { this.confirmDeleteAccount.set(null); }

  confirmDelete() {
    const account = this.confirmDeleteAccount();
    if (!account) return;
    this.accountsService.delete(account.id).subscribe({
      next: () => {
        this.confirmDeleteAccount.set(null);
        const remaining = this.accounts().filter(a => a.id !== account.id);
        this.accounts.set(remaining);
        if (remaining.length === 0) {
          this.router.navigate(['/setup']);
        }
      },
      error: (err) => {
        this.confirmDeleteAccount.set(null);
        this.toastr.error(err.error?.message ?? this.t().toast.error);
      },
    });
  }
}
