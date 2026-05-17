import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Loan, LoansResponse } from '../../../models/loan';

@Injectable({ providedIn: 'root' })
export class LoansService {
  private http = inject(HttpClient);
  private base = `${environment.apiBaseUrl}/loans`;

  getAll() {
    return this.http.get<LoansResponse>(this.base);
  }

  create(borrowerName: string, amount: number) {
    return this.http.post<Loan>(this.base, { borrowerName, amount });
  }

  delete(id: number) {
    return this.http.delete<Loan>(`${this.base}/${id}`);
  }
}
