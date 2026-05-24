import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { catchError, EMPTY, retry, timeout, timer } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ApiHealthService {
  private readonly http = inject(HttpClient);
  // Start ready — never block the UI. Health check is a background warm-up ping only.
  readonly isReady = signal(true);

  init(): void {
    this.http
      .get(`${environment.apiBaseUrl}/health`)
      .pipe(
        timeout(8000),
        retry({ count: 3, delay: () => timer(3000) }),
        catchError(() => EMPTY),
      )
      .subscribe();
  }
}
