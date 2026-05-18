import { Component, inject, signal, HostListener } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { Tooltip } from '../../shared/components/tooltip/tooltip';
import { Variant, TooltipPosition } from '../../shared/enums';
import { NavMenu } from '../../shared/interfaces';
import { BORDER_RADIUS } from '../../shared/constants';
import { ThemeService } from '../../shared/services/theme';
import { TEXTS } from '../../shared/texts';

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
  appName = TEXTS.app.name;
  private _router = inject(Router);

  activeMenu = signal<string | null>(null);

  navMenus: NavMenu[] = [
    {
      label: 'Home',
      route: '/',
    },
    {
      label: 'About Us',
      cols: 'grid-cols-3',
      sections: [
        {
          title: 'Our Story',
          links: [
            { icon: 'question', iconType: 'svg', label: 'How it All Started?', route: '/about/story' },
            { icon: 'stars', iconType: 'svg', label: 'How We Stand Out?', route: '/about/standout' },
          ],
        },
        {
          title: 'Achievements',
          links: [
            { icon: 'statistics', iconType: 'svg', label: 'Key Statistics', route: '/about/stats' },
            { icon: 'work', iconType: 'svg', label: 'Our Work', route: '/about/work' },
          ],
        },
        {
          title: 'Network',
          links: [
            { icon: 'handshake', iconType: 'svg', label: 'Clients & Partners', route: '/about/partners' },
            { icon: 'calendar', iconType: 'svg', label: 'Over The Years', route: '/about/timeline' },
          ],
        },
      ],
    },
    {
      label: 'What We Offer?',
      cols: 'grid-cols-3',
      sections: [
        {
          title: 'Consulting',
          links: [
            { icon: 'champions', iconType: 'svg', label: 'Tournament Consulting', route: '/offer/tournaments' },
            { icon: 'speaker', iconType: 'svg', label: 'Content & Marketing', route: '/offer/content' },
            { icon: 'podcast', iconType: 'svg', label: 'Interviews & Podcast', route: '/offer/podcast' },
          ],
        },
        {
          title: 'Events & Media',
          links: [
            { icon: 'calendar', iconType: 'svg', label: 'Events Host and Anchor', route: '/offer/events' },
            { icon: 'workshop', iconType: 'svg', label: 'Workshops', route: '/offer/workshops' },
            { icon: 'media', iconType: 'svg', label: 'Media Services', route: '/offer/media' },
          ],
        },
        {
          title: 'Connections',
          links: [
            { icon: 'speaker', iconType: 'svg', label: 'Influencer', route: '/offer/influencer' },
            { icon: 'stars', iconType: 'svg', label: 'Chess Celebrity Connect', route: '/offer/celebrity' },
            { icon: 'social', iconType: 'svg', label: 'Chess Social Media Channels', route: '/offer/social-media' },
          ],
        },
      ],
    },
    {
      label: "What's Hot?",
      cols: 'grid-cols-3',
      sections: [
        {
          title: 'News',
          links: [
            { icon: 'media', iconType: 'svg', label: 'Breaking News', route: '/hot/news' },
          ],
        },
        {
          title: 'Content',
          links: [
            { icon: 'work', iconType: 'svg', label: 'Blogs', route: '/hot/blogs' },
            { icon: 'podcast', iconType: 'svg', label: 'Podcast', route: '/hot/podcast' },
          ],
        },
        {
          title: 'Happenings',
          links: [
            { icon: 'calendar', iconType: 'svg', label: 'Events', route: '/hot/events' },
          ],
        },
      ],
    },
    {
      label: 'Contact Us',
      route: '/contact/inquiry',
    },
  ];

  get navClasses(): string {
    return `bg-gradient-to-r from-gray-950 via-gray-900 to-gray-950 dark:bg-none dark:bg-white text-white dark:text-gray-900 border border-gray-800 dark:border-gray-200 shadow-lg shadow-black/20 dark:shadow-black/5 transition-colors duration-200 ${this.radius.md}`;
  }

  homeLinkClasses(route?: string): string {
    const isActive = route && this._router.url === route;
    const active = 'text-white dark:text-gray-900 bg-white/30 dark:bg-gray-200';
    const inactive = 'text-gray-300 dark:text-gray-500 hover:text-white dark:hover:text-gray-900 hover:bg-white/10 dark:hover:bg-gray-100';
    return `px-5 py-2 transition-all inline-block ${isActive ? active : inactive} ${this.radius.md}`;
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
    const isOpen = this.activeMenu() === label;
    const isActive = this._isMenuActive(label);
    const active = 'text-white dark:text-gray-900 bg-white/30 dark:bg-gray-200';
    const inactive = 'text-gray-300 dark:text-gray-500 hover:text-white dark:hover:text-gray-900 hover:bg-white/10 dark:hover:bg-gray-100';
    const state = isOpen || isActive ? active : inactive;
    return `px-5 py-2 transition-all cursor-pointer flex items-center gap-1 ${state} ${this.radius.md}`;
  }

  private _isMenuActive(label: string): boolean {
    const url = this._router.url;
    const menu = this.navMenus.find(m => m.label === label);
    if (!menu?.sections) return false;
    return menu.sections.some(s => s.links.some(l => url.startsWith(l.route)));
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

  navIcon(icon: string): string {
    const prefix = this.themeService.isDark() ? 'black' : 'white';
    return `assets/navbar-icons/${prefix}-${icon}.svg`;
  }
}
