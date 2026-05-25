import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { catchError, EMPTY, retry, timeout, timer } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ApiHealthService {
  private readonly http = inject(HttpClient);
  readonly isReady = signal(false);

  init(): void {
    this.http
      .get(`${environment.apiBaseUrl}/health`)
      .pipe(
        timeout(8000),
        retry({ count: 3, delay: () => timer(3000) }),
        catchError(() => { this.isReady.set(true); return EMPTY; }),
      )
      .subscribe(() => this.isReady.set(true));
  }
}
