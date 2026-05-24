import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';
import { I18nService } from '../../../core/i18n/i18n.service';

type Status = 'idle' | 'loading' | 'error';

@Component({
  selector: 'app-login',
  imports: [RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  private auth = inject(AuthService);

  readonly t = inject(I18nService).t;

  email = signal('');
  password = signal('');
  status = signal<Status>('idle');

  get canSubmit(): boolean {
    return this.email().trim().length > 0 &&
      this.password().length > 0 &&
      this.status() !== 'loading';
  }

  async submit() {
    if (!this.canSubmit) return;
    this.status.set('loading');
    const result = await this.auth.signIn(this.email().trim(), this.password());
    if (result.error) {
      this.status.set('error');
    } else {
      // Hard reload so guards re-run against a freshly-persisted session cookie
      // (iOS standalone PWA can fail to attach the just-set cookie to in-process fetches).
      window.location.assign('/');
    }
  }
}
