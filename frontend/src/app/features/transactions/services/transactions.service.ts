import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Transaction } from '../../../models/transaction';

@Injectable({ providedIn: 'root' })
export class TransactionsService {
  private http = inject(HttpClient);
  private base = `${environment.apiBaseUrl}/accounts`;

  deposit(accountId: number, amount: number) {
    return this.http.post<Transaction>(`${this.base}/${accountId}/deposit`, { amount });
  }

  withdraw(accountId: number, amount: number, note: string) {
    return this.http.post<Transaction>(`${this.base}/${accountId}/withdraw`, { amount, note });
  }

  getByAccount(accountId: number) {
    return this.http.get<Transaction[]>(`${this.base}/${accountId}/transactions`);
  }
}
