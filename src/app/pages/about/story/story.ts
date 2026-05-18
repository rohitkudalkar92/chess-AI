import { Component } from '@angular/core';

interface Chapter {
  year: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-story',
  templateUrl: './story.html',
})
export class Story {
  chapters: Chapter[] = [
    {
      year: '1990s — 2000',
      title: 'Hobby Chess Player',
      description: 'Used to beat all elderly people and be happy. Chess was pure joy — no ratings, no pressure, just the love of the game.',
    },
    {
      year: '2000s — 2010',
      title: 'School & University Champion',
      description: 'While completing my Engineering & MBA, kept winning at chess competitions for school & university. I used to wait for the newspaper to follow games of Linares, Corus, Mainz, World Championships & so on!',
    },
    {
      year: '2010 — 2012',
      title: 'The Internet Changed Everything',
      description: 'Internet was making it easy to follow chess. Started watching all games on YouTube while working at office — chess became a daily companion.',
    },
    {
      year: '2013 — 2018',
      title: 'Anand vs Carlsen — The Breakout',
      description: 'Breakout year with Anand–Carlsen in Chennai. From the start of 2013 till date, I have not missed following a single major chess event. Access via internet kept helping watching events.',
    },
    {
      year: '2019 — 2022',
      title: 'Content Before Content Was Cool',
      description: 'With Tata Steel, India had guaranteed one elite chess event & I started creating content, when content was not born!',
    },
    {
      year: '2022 — 2026',
      title: 'ChessWithLokesh Is Born',
      description: 'Chennai Olympiad gave birth to my channel ChessWithLokesh in August 2023 — a place to keep all my photos and videos. Became a regular at top elite chess events globally!',
    },
  ];
}
