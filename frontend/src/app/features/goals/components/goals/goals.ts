import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { DatePipe, DecimalPipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AccountsService } from '../../../accounts/services/accounts.service';
import { GoalsService } from '../../services/goals.service';
import { Account } from '../../../../models/account';
import { Goal } from '../../../../models/goal';
import { I18nService } from '../../../../core/i18n/i18n.service';

type Tab = 'list' | 'create';
type Status = 'idle' | 'loading' | 'success' | 'error';

@Component({
  selector: 'app-goals',
  imports: [ReactiveFormsModule, DecimalPipe, DatePipe],
  templateUrl: './goals.html',
  styleUrl: './goals.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GoalsComponent implements OnInit {
  private accountsService = inject(AccountsService);
  private goalsService = inject(GoalsService);
  private fb = inject(FormBuilder);
  private toastr = inject(ToastrService);

  readonly t = inject(I18nService).t;

  accounts = toSignal(this.accountsService.getAll(), { initialValue: [] as Account[] });
  goals = signal<Goal[]>([]);
  goalsLoading = signal(true);
  activeTab = signal<Tab>('list');
  submitStatus = signal<Status>('idle');
  errorMessage = signal('');

  createForm = this.fb.group({
    accountId: [null as number | null, Validators.required],
    name: ['', [Validators.required, Validators.minLength(1)]],
    targetAmount: [null as number | null, [Validators.required, Validators.min(0.01)]],
    deadline: [''],
  });

  ngOnInit() {
    this.loadGoals();
  }

  setTab(tab: Tab) {
    this.activeTab.set(tab);
    this.submitStatus.set('idle');
    this.errorMessage.set('');
  }

  loadGoals() {
    this.goalsService.getAll().subscribe(goals => {
      this.goals.set(goals);
      this.goalsLoading.set(false);
    });
  }

  submitCreate() {
    if (this.createForm.invalid) return;
    const { accountId, name, targetAmount, deadline } = this.createForm.value;
    const payload: { accountId: number; name: string; targetAmount: number; deadline?: string } = {
      accountId: Number(accountId),
      name: name as string,
      targetAmount: targetAmount as number,
    };
    if (deadline) payload.deadline = deadline;

    this.submitStatus.set('loading');
    this.goalsService.create(payload).subscribe({
      next: () => {
        this.submitStatus.set('success');
        this.createForm.reset();
        this.loadGoals();
      },
      error: (err) => {
        this.submitStatus.set('error');
        const msg = err.error?.message ?? this.t().toast.error;
        this.errorMessage.set(msg);
        this.toastr.error(msg);
      },
    });
  }

  deleteGoal(id: number) {
    this.goalsService.delete(id).subscribe({
      next: () => {
        this.loadGoals();
      },
      error: (err) => this.toastr.error(err.error?.message ?? this.t().toast.error),
    });
  }

  accountName(accountId: number): string {
    return this.accounts().find(a => a.id === accountId)?.name ?? 'Unknown';
  }
}
