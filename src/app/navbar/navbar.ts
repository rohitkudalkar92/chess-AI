import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Button } from '../shared/button/button';
import { Tooltip } from '../shared/tooltip/tooltip';
import { Variant, TooltipPosition } from '../shared/enums';
import { NavMenu } from '../shared/interfaces';
import { ThemeService } from '../shared/services/theme';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, Button, Tooltip],
  templateUrl: './navbar.html',
})
export class Navbar {
  Variant = Variant;
  TooltipPosition = TooltipPosition;
  themeService = inject(ThemeService);

  navMenus: NavMenu[] = [
    {
      label: 'Play',
      width: 'w-[620px]',
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
      width: 'w-[480px]',
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
      width: 'w-[380px]',
      cols: 'grid-cols-2',
      align: 'right',
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

  isExternal(route: string): boolean {
    return route.startsWith('http');
  }
}
