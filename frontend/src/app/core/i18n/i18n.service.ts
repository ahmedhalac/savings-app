import { Injectable, computed, signal } from '@angular/core';
import { Locale, Translations } from './translations/index';
import { enUS } from './translations/en-US';
import { bs } from './translations/bs';

const LOCALES: Record<Locale, Translations> = { 'en-US': enUS, bs };
const STORAGE_KEY = 'savings-locale';

@Injectable({ providedIn: 'root' })
export class I18nService {
  private readonly locale = signal<Locale>(this.loadLocale());

  readonly t = computed<Translations>(() => LOCALES[this.locale()]);
  readonly currentLocale = this.locale.asReadonly();

  setLocale(locale: Locale): void {
    this.locale.set(locale);
    localStorage.setItem(STORAGE_KEY, locale);
  }

  private loadLocale(): Locale {
    const stored = localStorage.getItem(STORAGE_KEY) as Locale | null;
    return stored && stored in LOCALES ? stored : 'en-US';
  }
}
