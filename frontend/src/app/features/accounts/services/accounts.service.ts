import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Account, AccountsSummary } from '../../../models/account';

@Injectable({ providedIn: 'root' })
export class AccountsService {
  private http = inject(HttpClient);
  private base = `${environment.apiBaseUrl}/accounts`;

  create(data: { name: string; type: 'savings' | 'current' | 'buffer' }) {
    return this.http.post<Account>(this.base, data);
  }

  delete(id: number) {
    return this.http.delete(`${this.base}/${id}`);
  }

  getAll() {
    return this.http.get<Account[]>(this.base);
  }

  getSummary() {
    return this.http.get<AccountsSummary>(`${this.base}/summary`);
  }
}
