import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { race, retry, timer } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ApiHealthService {
  private readonly http = inject(HttpClient);
  readonly isReady = signal(false);

  init(): void {
    // race: whichever fires first wins — health OK or 25s max wait
    race(
      this.http.get(`${environment.apiBaseUrl}/health`).pipe(retry({ delay: () => timer(3000) })),
      timer(25000),
    ).subscribe(() => this.isReady.set(true));
  }
}
