import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ThemeService } from '../theme.service';

@Component({
  selector: 'app-theme-toggle',
  templateUrl: './theme-toggle.html',
  styleUrl: './theme-toggle.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class ThemeToggleComponent {
  private theme = inject(ThemeService);
  readonly isDark = this.theme.isDark;

  toggle(): void {
    this.theme.toggle();
  }
}
