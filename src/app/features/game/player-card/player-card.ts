import { Component, input } from '@angular/core';

import { Player } from '../../../shared/interfaces';
import { Variant } from '../../../shared/enums';
import { BORDER_RADIUS } from '../../../shared/constants';

@Component({
  selector: 'app-player-card',
  templateUrl: './player-card.html',
})
export class PlayerCard {
  player = input.required<Player>();
  time = input<string>('10:00');
  isActive = input(false);

  radius = BORDER_RADIUS;

  get containerClasses(): string {
    const active = 'bg-amber-50 dark:bg-amber-500/10 border-amber-400 dark:border-amber-500/40 shadow-amber-200/40 dark:shadow-amber-500/10 ring-1 ring-amber-300/50 dark:ring-amber-500/20';
    const inactive = 'bg-white dark:bg-gray-800/80 border-gray-200 dark:border-gray-700/60';
    return `w-72 flex flex-col items-center gap-4 px-5 py-6 border transition-all duration-300 shadow-sm ${this.isActive() ? active : inactive} ${this.radius.md}`;
  }

  get avatarBgClasses(): string {
    return this.player().color === Variant.White
      ? `bg-white border border-gray-200 ${this.radius.md}`
      : `bg-gray-900 border border-gray-700 ${this.radius.md}`;
  }

  get statusDotClasses(): string {
    return `absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full`;
  }

  get timerClasses(): string {
    const active = 'bg-amber-500 text-white shadow-md shadow-amber-500/30';
    const inactive = 'bg-gray-100 dark:bg-gray-700/60 text-gray-800 dark:text-gray-200';
    return `font-mono text-5xl font-bold px-5 py-2.5 w-full text-center transition-all duration-300 ${this.isActive() ? active : inactive} ${this.radius.md}`;
  }

  get ratingLabel(): string {
    return `${this.player().rating} ELO`;
  }

  get colorLabel(): string {
    const icon = this.player().color === Variant.White ? '⬜' : '⬛';
    return `${icon} ${this.player().color}`;
  }
}
