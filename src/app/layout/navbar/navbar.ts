import { Component, inject, signal, HostListener } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Tooltip } from '../../shared/components/tooltip/tooltip';
import { Variant, TooltipPosition } from '../../shared/enums';
import { NavMenu } from '../../shared/interfaces';
import { BORDER_RADIUS } from '../../shared/constants';
import { ThemeService } from '../../shared/services/theme';

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
            { icon: '📖', label: 'How it All Started?', route: '/about/story' },
            { icon: '✨', label: 'How We Stand Out?', route: '/about/standout' },
          ],
        },
        {
          title: 'Achievements',
          links: [
            { icon: '📊', label: 'Key Statistics', route: '/about/stats' },
            { icon: '💼', label: 'Our Work', route: '/about/work' },
          ],
        },
        {
          title: 'Network',
          links: [
            { icon: '🤝', label: 'Clients & Partners', route: '/about/partners' },
            { icon: '📅', label: 'Over The Years', route: '/about/timeline' },
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
            { icon: '🏆', label: 'Tournament Consulting', route: '/offer/tournaments' },
            { icon: '📝', label: 'Content & Marketing', route: '/offer/content' },
            { icon: '🎙', label: 'Interviews & Podcast', route: '/offer/podcast' },
          ],
        },
        {
          title: 'Events & Media',
          links: [
            { icon: '🎪', label: 'Hosting / Anchor Events', route: '/offer/events' },
            { icon: '🎓', label: 'Workshops', route: '/offer/workshops' },
            { icon: '🎬', label: 'Media Services', route: '/offer/media' },
          ],
        },
        {
          title: 'Connections',
          links: [
            { icon: '📢', label: 'Influencer', route: '/offer/influencer' },
            { icon: '⭐', label: 'Chess Celebrity Connect', route: '/offer/celebrity' },
            { icon: '📱', label: 'Chess Social Media Channels', route: '/offer/social-media' },
          ],
        },
      ],
    },
    {
      label: 'Everything Chess',
      cols: 'grid-cols-3',
      sections: [
        {
          title: 'Compete',
          links: [
            { icon: '♟', label: 'Chess Tournaments', route: '/chess/tournaments' },
            { icon: '📈', label: 'Chess Rankings', route: '/chess/rankings' },
            { icon: '👤', label: 'Chess Players Rankings', route: '/chess/players' },
          ],
        },
        {
          title: 'Explore',
          links: [
            { icon: '🌐', label: 'Chess Websites', route: '/chess/websites' },
            { icon: '💻', label: 'Chess Online', route: '/chess/online' },
            { icon: '📰', label: 'Chess Magazines', route: '/chess/magazines' },
          ],
        },
        {
          title: 'Community',
          links: [
            { icon: '🏠', label: 'Chess Clubs', route: '/chess/clubs' },
            { icon: '♜', label: 'Chess Sets', route: '/chess/sets' },
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
            { icon: '📰', label: 'Breaking News', route: '/hot/news' },
          ],
        },
        {
          title: 'Content',
          links: [
            { icon: '📝', label: 'Blogs', route: '/hot/blogs' },
            { icon: '🎙', label: 'Podcast', route: '/hot/podcast' },
          ],
        },
        {
          title: 'Happenings',
          links: [
            { icon: '🎉', label: 'Events', route: '/hot/events' },
          ],
        },
      ],
    },
    {
      label: 'Contact Us',
      cols: 'grid-cols-3',
      sections: [
        {
          title: 'Reach Out',
          links: [
            { icon: '📬', label: 'Inquiry / Feedback Form', route: '/contact/inquiry' },
          ],
        },
        {
          title: 'Connect',
          links: [
            { icon: '🔗', label: 'Social Media Links', route: '/contact/social' },
          ],
        },
        {
          title: 'Request',
          links: [
            { icon: '♟', label: 'Finally Anything in Chess!', route: '/contact/request' },
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
