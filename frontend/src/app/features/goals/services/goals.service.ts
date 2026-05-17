import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Goal } from '../../../models/goal';

@Injectable({ providedIn: 'root' })
export class GoalsService {
  private http = inject(HttpClient);
  private base = `${environment.apiBaseUrl}/goals`;

  getAll() {
    return this.http.get<Goal[]>(this.base);
  }

  create(data: { accountId: number; name: string; targetAmount: number; deadline?: string }) {
    return this.http.post<Goal>(this.base, data);
  }

  delete(id: number) {
    return this.http.delete<Goal>(`${this.base}/${id}`);
  }
}
