import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { I18nService, } from '../i18n.service';
import { Locale } from '../translations/index';

@Component({
  selector: 'app-lang-picker',
  templateUrl: './lang-picker.html',
  styleUrl: './lang-picker.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class LangPickerComponent {
  private i18n = inject(I18nService);

  readonly currentLocale = this.i18n.currentLocale;

  setLocale(locale: Locale): void {
    this.i18n.setLocale(locale);
  }
}
