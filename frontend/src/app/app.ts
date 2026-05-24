import { AfterViewInit, ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { I18nService } from './core/i18n/i18n.service';
import { LangPickerComponent } from './core/i18n/lang-picker/lang-picker';
import { ThemeToggleComponent } from './core/theme/theme-toggle/theme-toggle';
import { ApiHealthService } from './core/services/api-health.service';
import { LogoComponent } from './shared/logo/logo';
import { AuthService } from './core/auth/auth.service';
import { ProfileMenuComponent } from './core/profile-menu/profile-menu.component';
import { AccountsService } from './features/accounts/services/accounts.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, LangPickerComponent, ThemeToggleComponent, LogoComponent, ProfileMenuComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App implements AfterViewInit {
  readonly t = inject(I18nService).t;
  private readonly health = inject(ApiHealthService);
  readonly apiReady = this.health.isReady;
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly accountsService = inject(AccountsService);
  readonly isAuthenticated = this.auth.isAuthenticated;

  async signOut() {
    this.accountsService.invalidateCache();
    void this.router.navigate(['/login']);
    await this.auth.signOut();
  }

  constructor() {
    this.health.init();
  }

  ngAfterViewInit() {
    document.getElementById('app-loader')?.remove();
  }
}
