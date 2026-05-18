import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Variant } from '../../shared/enums';
import { BORDER_RADIUS } from '../../shared/constants';
import { TEXTS } from '../../shared/texts';
import { ThemeService } from '../../shared/services/theme';

interface FooterSection {
  title: string;
  links: { label: string; route: string }[];
}

@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  templateUrl: './footer.html',
})
export class Footer {
  Variant = Variant;
  radius = BORDER_RADIUS;
  themeService = inject(ThemeService);
  texts = TEXTS.footer;

  currentYear = new Date().getFullYear();

  sections: FooterSection[] = [
    {
      title: 'About Us',
      links: [
        { label: 'How it All Started?', route: '/about/story' },
        { label: 'How We Stand Out?', route: '/about/standout' },
        { label: 'Key Statistics', route: '/about/stats' },
        { label: 'Clients & Partners', route: '/about/partners' },
      ],
    },
    {
      title: 'What We Offer?',
      links: [
        { label: 'Tournament Consulting', route: '/offer/tournaments' },
        { label: 'Workshops', route: '/offer/workshops' },
        { label: 'Media Services', route: '/offer/media' },
        { label: 'Chess Celebrity Connect', route: '/offer/celebrity' },
      ],
    },
    {
      title: "What's Hot?",
      links: [
        { label: 'Breaking News', route: '/hot/news' },
        { label: 'Blogs', route: '/hot/blogs' },
        { label: 'Podcast', route: '/hot/podcast' },
        { label: 'Events', route: '/hot/events' },
      ],
    },
    {
      title: 'Contact Us',
      links: [
        { label: 'Inquiry / Feedback', route: '/contact/inquiry' },
      ],
    },
  ];

  contactForm = { name: '', email: '', message: '' };

  socials = [
    { icon: 'instagram', label: 'Instagram', url: 'https://www.instagram.com/chesswithlokesh/' },
    { icon: 'facebook', label: 'Facebook', url: 'https://www.facebook.com/profile.php?id=61561130082582' },
    { icon: 'youtube', label: 'YouTube', url: 'https://www.youtube.com/@ChessWithLokesh' },
    { icon: 'linkedin', label: 'LinkedIn', url: 'https://www.linkedin.com/in/lokeshnatoo/' },
    { icon: 'twitter', label: 'Twitter', url: 'https://x.com/ChessWithLokesh' },
  ];

  socialIcon(icon: string): string {
    const prefix = this.themeService.isDark() ? 'black' : 'white';
    return `assets/scocial/${prefix}-${icon}.svg`;
  }
}
