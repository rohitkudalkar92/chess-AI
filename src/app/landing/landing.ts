import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Button } from '../shared/button/button';
import { Variant, ButtonSize } from '../shared/enums';

interface Feature {
  icon: string;
  title: string;
  description: string;
}

interface Step {
  number: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-landing',
  imports: [RouterLink, Button],
  templateUrl: './landing.html',
})
export class Landing {
  Variant = Variant;
  ButtonSize = ButtonSize;

  features: Feature[] = [
    {
      icon: '🤖',
      title: 'Smart AI Opponents',
      description: 'Challenge yourself against three difficulty levels — from beginner-friendly to grandmaster-level play.',
    },
    {
      icon: '🎮',
      title: 'Multiple Game Modes',
      description: 'Play vs AI, challenge a friend locally, or compete online with players around the world.',
    },
    {
      icon: '⏱',
      title: 'Time Controls',
      description: 'Bullet, Blitz, or Rapid — pick your pace and sharpen your skills under pressure.',
    },
  ];

  steps: Step[] = [
    {
      number: '01',
      title: 'Choose Your Mode',
      description: 'Pick a game mode, difficulty, and time control that suits your style.',
    },
    {
      number: '02',
      title: 'Play Your Game',
      description: 'Make your moves on a beautiful, responsive board with real-time feedback.',
    },
    {
      number: '03',
      title: 'Learn & Improve',
      description: 'Review your games, solve puzzles, and train with tactics to level up.',
    },
  ];
}
