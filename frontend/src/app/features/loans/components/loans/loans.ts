import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { LoansService } from '../../services/loans.service';
import { Loan } from '../../../../models/loan';
import { I18nService } from '../../../../core/i18n/i18n.service';

type Tab = 'list' | 'create';
type Status = 'idle' | 'loading' | 'success' | 'error';

@Component({
  selector: 'app-loans',
  imports: [ReactiveFormsModule, DecimalPipe, DatePipe],
  templateUrl: './loans.html',
  styleUrl: './loans.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoansComponent implements OnInit {
  private loansService = inject(LoansService);
  private fb = inject(FormBuilder);
  private toastr = inject(ToastrService);

  readonly t = inject(I18nService).t;

  loans = signal<Loan[]>([]);
  totalLoaned = signal(0);
  loansLoading = signal(true);
  activeTab = signal<Tab>('list');
  submitStatus = signal<Status>('idle');
  errorMessage = signal('');

  createForm = this.fb.group({
    borrowerName: ['', [Validators.required, Validators.minLength(1)]],
    amount: [null as number | null, [Validators.required, Validators.min(0.01)]],
  });

  ngOnInit() {
    this.loadLoans();
  }

  setTab(tab: Tab) {
    this.activeTab.set(tab);
    this.submitStatus.set('idle');
    this.errorMessage.set('');
  }

  loadLoans() {
    this.loansService.getAll().subscribe(res => {
      this.loans.set(res.loans);
      this.totalLoaned.set(res.totalLoaned);
      this.loansLoading.set(false);
    });
  }

  submitCreate() {
    if (this.createForm.invalid) return;
    const { borrowerName, amount } = this.createForm.value;
    this.submitStatus.set('loading');
    this.loansService.create(borrowerName as string, amount as number).subscribe({
      next: () => {
        this.submitStatus.set('success');
        this.createForm.reset();
        this.loadLoans();
      },
      error: (err) => {
        this.submitStatus.set('error');
        const msg = err.error?.message ?? this.t().toast.error;
        this.errorMessage.set(msg);
        this.toastr.error(msg);
      },
    });
  }

  deleteLoan(id: number) {
    this.loansService.delete(id).subscribe({
      next: () => {
        this.loadLoans();
      },
      error: (err) => this.toastr.error(err.error?.message ?? this.t().toast.error),
    });
  }
}
