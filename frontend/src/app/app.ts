import { AfterViewInit, ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { I18nService } from './core/i18n/i18n.service';
import { LangPickerComponent } from './core/i18n/lang-picker/lang-picker';
import { ThemeToggleComponent } from './core/theme/theme-toggle/theme-toggle';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, LangPickerComponent, ThemeToggleComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App implements AfterViewInit {
  readonly t = inject(I18nService).t;

  ngAfterViewInit() {
    document.getElementById('app-loader')?.remove();
  }
}
