import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { AccountsService } from '../../../accounts/services/accounts.service';
import { I18nService } from '../../../../core/i18n/i18n.service';

type AccountType = 'savings' | 'current';
type Status = 'idle' | 'loading' | 'error';

interface AccountEntry {
  name: string;
  type: AccountType;
}

@Component({
  selector: 'app-setup',
  imports: [FormsModule],
  templateUrl: './setup.html',
  styleUrl: './setup.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SetupComponent {
  private accountsService = inject(AccountsService);
  private router = inject(Router);

  readonly t = inject(I18nService).t;

  entries = signal<AccountEntry[]>([{ name: '', type: 'savings' }]);
  status = signal<Status>('idle');
  confirmRemoveIndex = signal<number | null>(null);

  addEntry() {
    this.entries.update(list => [...list, { name: '', type: 'current' }]);
  }

  requestRemove(index: number) {
    this.confirmRemoveIndex.set(index);
  }

  cancelRemove() {
    this.confirmRemoveIndex.set(null);
  }

  confirmRemove() {
    const index = this.confirmRemoveIndex();
    if (index === null) return;
    this.entries.update(list => list.filter((_, i) => i !== index));
    this.confirmRemoveIndex.set(null);
  }

  updateName(index: number, name: string) {
    this.entries.update(list =>
      list.map((e, i) => (i === index ? { ...e, name } : e)),
    );
  }

  updateType(index: number, type: AccountType) {
    this.entries.update(list =>
      list.map((e, i) => (i === index ? { ...e, type } : e)),
    );
  }

  get canSubmit(): boolean {
    return this.entries().length > 0 &&
      this.entries().every(e => e.name.trim().length > 0) &&
      this.status() !== 'loading';
  }

  submit() {
    if (!this.canSubmit) return;
    this.status.set('loading');
    const requests = this.entries().map(e =>
      this.accountsService.create({ name: e.name.trim(), type: e.type }),
    );
    forkJoin(requests).subscribe({
      next: () => this.router.navigate(['/']),
      error: () => this.status.set('error'),
    });
  }
}
