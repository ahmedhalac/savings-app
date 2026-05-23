import { ChangeDetectionStrategy, Component, HostListener, inject, output, signal } from '@angular/core';
import { I18nService } from '../i18n/i18n.service';

@Component({
  selector: 'app-profile-menu',
  templateUrl: './profile-menu.component.html',
  styleUrl: './profile-menu.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileMenuComponent {
  readonly t = inject(I18nService).t;
  readonly logout = output<void>();
  readonly open = signal(false);

  toggle(): void {
    this.open.update(v => !v);
  }

  onLogout(): void {
    this.open.set(false);
    this.logout.emit();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!(event.target as Element).closest('app-profile-menu')) {
      this.open.set(false);
    }
  }
}
