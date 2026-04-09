import { Component, inject, signal, HostListener } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Tooltip } from '../shared/tooltip/tooltip';
import { Variant, TooltipPosition } from '../shared/enums';
import { NavMenu } from '../shared/interfaces';
import { BORDER_RADIUS } from '../shared/constants';
import { ThemeService } from '../shared/services/theme';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, Tooltip],
  templateUrl: './navbar.html',
})
export class Navbar {
  Variant = Variant;
  TooltipPosition = TooltipPosition;
  radius = BORDER_RADIUS;
  themeService = inject(ThemeService);

  activeMenu = signal<string | null>(null);

  navMenus: NavMenu[] = [
    {
      label: 'Play',
      cols: 'grid-cols-3',
      sections: [
        {
          title: 'Game Modes',
          links: [
            { icon: '♟', label: 'Play vs AI', route: '/play/vs-ai' },
            { icon: '👥', label: 'Local Match', route: '/play/local' },
            { icon: '🌐', label: 'Online Match', route: '/play/online' },
          ],
        },
        {
          title: 'Difficulty',
          links: [
            { icon: '🟢', label: 'Easy', route: '/play/easy', hoverClass: 'hover:bg-green-50 hover:text-green-700' },
            { icon: '🟡', label: 'Medium', route: '/play/medium', hoverClass: 'hover:bg-amber-50 hover:text-amber-700' },
            { icon: '🔴', label: 'Hard', route: '/play/hard', hoverClass: 'hover:bg-red-50 hover:text-red-700' },
          ],
        },
        {
          title: 'Time Controls',
          links: [
            { icon: '⚡', label: 'Bullet · 1 min', route: '/play/bullet' },
            { icon: '🔥', label: 'Blitz · 5 min', route: '/play/blitz' },
            { icon: '⏱', label: 'Rapid · 15 min', route: '/play/rapid' },
          ],
        },
      ],
    },
    {
      label: 'Learn',
      cols: 'grid-cols-2',
      sections: [
        {
          title: 'Tutorials',
          links: [
            { icon: '📖', label: 'Chess Basics', route: '/learn/basics' },
            { icon: '🏁', label: 'Openings', route: '/learn/openings' },
            { icon: '🏆', label: 'Endgames', route: '/learn/endgames' },
          ],
        },
        {
          title: 'Practice',
          links: [
            { icon: '🧩', label: 'Puzzles', route: '/learn/puzzles' },
            { icon: '⚔️', label: 'Tactics Trainer', route: '/learn/tactics' },
            { icon: '📊', label: 'Game Analysis', route: '/learn/analysis' },
          ],
        },
      ],
    },
    {
      label: 'About',
      cols: 'grid-cols-2',
      sections: [
        {
          title: 'Project',
          links: [
            { icon: 'ℹ️', label: 'About Us', route: '/about' },
            { icon: '🛠', label: 'Tech Stack', route: '/about/tech' },
          ],
        },
        {
          title: 'Community',
          links: [
            { icon: '🐙', label: 'GitHub', route: 'https://github.com' },
            { icon: '📬', label: 'Contact', route: '/contact' },
          ],
        },
      ],
    },
  ];

  get navClasses(): string {
    return `bg-gradient-to-r from-gray-950 via-gray-900 to-gray-950 dark:bg-none dark:bg-white text-white dark:text-gray-900 border border-gray-800 dark:border-gray-200 shadow-lg shadow-black/20 dark:shadow-black/5 transition-colors duration-200 ${this.radius.md}`;
  }

  get homeLinkClasses(): string {
    return `px-5 py-2 text-gray-300 dark:text-gray-500 hover:text-white dark:hover:text-gray-900 hover:bg-white/10 dark:hover:bg-gray-100 transition-all inline-block ${this.radius.md}`;
  }

  get themeToggleLabel(): string {
    return this.themeService.isDark() ? 'Switch to light mode' : 'Switch to dark mode';
  }

  get themeButtonClasses(): string {
    return `p-2 transition-all cursor-pointer ring-1 ring-inset bg-white dark:bg-gray-900 ring-gray-200 dark:ring-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 ${this.radius.md}`;
  }

  get panelClasses(): string {
    return `absolute left-0 right-0 top-full mt-2 mx-4 border border-gray-800 dark:border-gray-200 bg-gray-950 dark:bg-white px-8 py-6 shadow-2xl shadow-black/30 dark:shadow-black/10 animate-slide-down ${this.radius.md}`;
  }

  menuButtonClasses(label: string): string {
    const active = 'text-white dark:text-gray-900 bg-white/15 dark:bg-gray-100';
    const inactive = 'text-gray-300 dark:text-gray-500 hover:text-white dark:hover:text-gray-900 hover:bg-white/10 dark:hover:bg-gray-100';
    const state = this.activeMenu() === label ? active : inactive;
    return `px-5 py-2 transition-all cursor-pointer flex items-center gap-1 ${state} ${this.radius.md}`;
  }

  chevronClasses(label: string): string {
    return `w-3.5 h-3.5 mt-0.5 transition-transform duration-200 ${this.activeMenu() === label ? 'rotate-180' : ''}`;
  }

  themeIconClasses(visible: boolean): string {
    return `w-5 h-5 absolute inset-0 transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`;
  }

  linkClasses(hoverClass?: string): string {
    return `flex items-center gap-3 px-3 py-2.5 text-sm text-gray-300 dark:text-gray-600 hover:text-white dark:hover:text-gray-900 hover:bg-white/10 dark:hover:bg-gray-200/60 transition-all ${hoverClass ?? ''} ${this.radius.md}`;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('app-navbar')) {
      this.closeMenu();
    }
  }

  toggleMenu(label: string): void {
    this.activeMenu.set(this.activeMenu() === label ? null : label);
  }

  closeMenu(): void {
    this.activeMenu.set(null);
  }

  isExternal(route: string): boolean {
    return route.startsWith('http');
  }
}
