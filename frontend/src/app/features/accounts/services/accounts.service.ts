import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { shareReplay, tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { Account, AccountsSummary } from '../../../models/account';

@Injectable({ providedIn: 'root' })
export class AccountsService {
  private http = inject(HttpClient);
  private base = `${environment.apiBaseUrl}/accounts`;
  private allCache$: Observable<Account[]> | null = null;

  invalidateCache() {
    this.allCache$ = null;
  }

  create(data: { name: string; type: 'savings' | 'current' | 'buffer' }) {
    return this.http.post<Account>(this.base, data).pipe(tap(() => this.invalidateCache()));
  }

  delete(id: number) {
    return this.http.delete(`${this.base}/${id}`).pipe(tap(() => this.invalidateCache()));
  }

  getAll() {
    if (!this.allCache$) {
      this.allCache$ = this.http.get<Account[]>(this.base).pipe(shareReplay(1));
    }
    return this.allCache$;
  }

  getSummary() {
    return this.http.get<AccountsSummary>(`${this.base}/summary`);
  }
}
