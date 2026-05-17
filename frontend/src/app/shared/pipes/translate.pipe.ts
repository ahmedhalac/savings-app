import { Pipe, PipeTransform, inject } from '@angular/core';
import { I18nService } from '../../core/i18n/i18n.service';

@Pipe({
  name: 'translate',
  pure: false,
  standalone: true,
})
export class TranslatePipe implements PipeTransform {
  private i18n = inject(I18nService);

  transform(keyPath: string): string {
    const keys = keyPath.split('.');
    let value: unknown = this.i18n.t();
    for (const key of keys) {
      value = (value as Record<string, unknown>)[key];
    }
    return typeof value === 'string' ? value : keyPath;
  }
}
