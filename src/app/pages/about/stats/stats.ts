import { Component, ElementRef, AfterViewInit, OnDestroy, signal } from '@angular/core';
import { TEXTS } from '../../../shared/texts';

interface Stat {
  title: string;
  value: number;
  suffix: string;
  description: string;
  display: string;
}

@Component({
  selector: 'app-stats',
  templateUrl: './stats.html',
})
export class Stats implements AfterViewInit, OnDestroy {
  texts = TEXTS.stats;

  steps = signal<Stat[]>([
    { title: 'Total Views', value: 521, suffix: 'M+', description: 'Across all platforms and social media channels worldwide.', display: '0' },
    { title: 'Global Elite Events', value: 21, suffix: '', description: 'Covered top-tier chess tournaments across the globe.', display: '0' },
    { title: 'World Chess Championships', value: 5, suffix: '', description: 'Present at the biggest stage of competitive chess.', display: '0' },
    { title: 'Countries', value: 7, suffix: '', description: 'India, Netherlands, UK, Norway, Germany, Spain, and more.', display: '0' },
    { title: 'Clients', value: 15, suffix: '', description: 'Trusted by brands, federations, and chess organizations.', display: '0' },
    { title: 'Net Promoter Score', value: 98, suffix: '%', description: 'Our clients love what we deliver — and keep coming back.', display: '0' },
  ]);

  private _observer: IntersectionObserver | null = null;
  private _animated = false;

  constructor(private _el: ElementRef) {}

  ngAfterViewInit(): void {
    this._observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !this._animated) {
          this._animated = true;
          this._animateCounters();
        }
      },
      { threshold: 0.3 }
    );
    this._observer.observe(this._el.nativeElement);
  }

  ngOnDestroy(): void {
    this._observer?.disconnect();
  }

  private _animateCounters(): void {
    const duration = 2000;
    const totalSteps = 60;
    const interval = duration / totalSteps;
    let current = 0;

    const timer = setInterval(() => {
      current++;
      const progress = current / totalSteps;
      const eased = 1 - Math.pow(1 - progress, 3);

      this.steps.update(steps =>
        steps.map(stat => ({
          ...stat,
          display: Math.round(stat.value * eased).toString(),
        }))
      );

      if (current >= totalSteps) clearInterval(timer);
    }, interval);
  }
}
