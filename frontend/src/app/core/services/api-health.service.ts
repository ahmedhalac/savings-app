import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { race, retry, timeout, timer } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ApiHealthService {
  private readonly http = inject(HttpClient);
  readonly isReady = signal(false);

  init(): void {
    // Each individual request times out after 8s (so it errors and retries rather than hanging).
    // Overall race caps the entire wait at 15s — after that the UI unlocks regardless.
    race(
      this.http.get(`${environment.apiBaseUrl}/health`).pipe(
        timeout(8000),
        retry({ delay: () => timer(2000) }),
      ),
      timer(15000),
    ).subscribe(() => this.isReady.set(true));
  }
}
