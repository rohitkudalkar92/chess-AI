import { Component, AfterViewInit, ElementRef, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Button } from '../../shared/components/button/button';
import { Variant, ButtonSize } from '../../shared/enums';
import { BORDER_RADIUS } from '../../shared/constants';
import { TEXTS } from '../../shared/texts';
import { LocationsMap } from '../../shared/components/locations-map/locations-map';

interface Milestone {
  year: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-landing',
  imports: [RouterLink, Button, LocationsMap],
  templateUrl: './landing.html',
})
export class Landing implements AfterViewInit {
  Variant = Variant;
  ButtonSize = ButtonSize;
  radius = BORDER_RADIUS;
  texts = TEXTS.landing;

  private _counter = viewChild<ElementRef>('counter');

  ngAfterViewInit() {
    const el = this._counter()?.nativeElement;
    if (!el) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        this._animateCount(el, 0, 7, 1000);
        observer.disconnect();
      }
    }, { threshold: 0.5 });
    observer.observe(el);
  }

  private _animateCount(el: HTMLElement, start: number, end: number, duration: number) {
    const startTime = performance.now();
    const step = (currentTime: number) => {
      const progress = Math.min((currentTime - startTime) / duration, 1);
      el.textContent = String(Math.floor(progress * (end - start) + start));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  milestones: Milestone[] = [
    { year: '1990s', title: 'Hobby Chess Player', description: 'Used to beat all elderly people and be happy.' },
    { year: '2000s', title: 'School & University', description: 'Kept winning chess competitions during Engineering & MBA.' },
    { year: '2010', title: 'Internet Era', description: 'Started watching all games on YouTube while working at office.' },
    { year: '2013', title: 'Anand vs Carlsen', description: 'Breakout year — haven\'t missed a single major chess event since.' },
    { year: '2019', title: 'Content Creator', description: 'Tata Steel India sparked content creation before it was a thing.' },
    { year: '2022', title: 'Chennai Olympiad', description: 'The event that changed everything.' },
    { year: '2023', title: 'ChessWithLokesh', description: 'Channel born in August — a home for all photos and videos.' },
    { year: '2024', title: 'Going Global', description: 'Became a regular at top elite chess events worldwide.' },
    { year: '2025', title: 'Norway & Beyond', description: 'Norway Chess, Women\'s Grand Prix, World Rapid & Blitz.' },
    { year: '2026', title: 'The Journey Continues', description: 'Norway Chess, Tata Steel — and counting.' },
  ];
}
