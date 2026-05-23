import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { retry, timer } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ApiHealthService {
  private readonly http = inject(HttpClient);
  readonly isReady = signal(false);

  init(): void {
    this.http
      .get(`${environment.apiBaseUrl}/health`)
      .pipe(retry({ delay: () => timer(3000) }))
      .subscribe(() => this.isReady.set(true));
  }
}
