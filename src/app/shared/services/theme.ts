import { Injectable, signal, computed } from '@angular/core';
import { Variant } from '../enums';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  // Public properties
  theme = signal<Variant>(this._getInitialTheme());
  isDark = computed(() => this.theme() === Variant.Black);

  constructor() {
    this._applyTheme(this.theme());
  }

  // Public methods
  toggleTheme(): void {
    const next: Variant = this.isDark() ? Variant.White : Variant.Black;
    this.theme.set(next);
    localStorage.setItem('theme', next);
    this._applyTheme(next);
  }

  // Private methods
  private _getInitialTheme(): Variant {
    const stored = localStorage.getItem('theme') as Variant | null;
    if (stored) return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? Variant.Black : Variant.White;
  }

  private _applyTheme(theme: Variant): void {
    document.documentElement.classList.toggle('dark', theme === Variant.Black);
    const favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement | null;
    if (favicon) {
      favicon.href = theme === Variant.Black ? 'assets/icons/white-king.svg' : 'assets/icons/black-king.svg';
    }
  }
}
