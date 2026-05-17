import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Account, AccountsSummary } from '../../../models/account';

@Injectable({ providedIn: 'root' })
export class AccountsService {
  private http = inject(HttpClient);
  private base = `${environment.apiBaseUrl}/accounts`;

  getAll() {
    return this.http.get<Account[]>(this.base);
  }

  getSummary() {
    return this.http.get<AccountsSummary>(`${this.base}/summary`);
  }
}
