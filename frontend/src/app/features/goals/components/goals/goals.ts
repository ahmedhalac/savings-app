import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { GoalsService } from '../../services/goals.service';
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
  private goalsService = inject(GoalsService);
  private fb = inject(FormBuilder);
  private toastr = inject(ToastrService);

  readonly t = inject(I18nService).t;

  goals = signal<Goal[]>([]);
  goalsLoading = signal(true);
  activeTab = signal<Tab>('list');
  submitStatus = signal<Status>('idle');
  errorMessage = signal('');

  createForm = this.fb.group({
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
    const { name, targetAmount, deadline } = this.createForm.value;
    const payload: { name: string; targetAmount: number; deadline?: string } = {
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

  projectedLabel(goal: Goal): string {
    const t = this.t().goals;
    if ((goal.percentComplete ?? 0) >= 100) return t.goalComplete;
    if (!goal.projectedCompletionDate) return t.noDepositHistory;
    const date = new Date(goal.projectedCompletionDate);
    const formatted = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    return `${t.projectedDone} ${formatted}`;
  }
}
