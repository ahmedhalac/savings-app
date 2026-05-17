import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { LoansResponse } from '../../../models/loan';

@Injectable({ providedIn: 'root' })
export class LoansService {
  private http = inject(HttpClient);
  private base = `${environment.apiBaseUrl}/loans`;

  getAll() {
    return this.http.get<LoansResponse>(this.base);
  }
}
