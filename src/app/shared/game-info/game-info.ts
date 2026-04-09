import { Component, input } from '@angular/core';

import { GameInfoItem } from '../interfaces';
import { BORDER_RADIUS } from '../constants';

@Component({
  selector: 'app-game-info',
  templateUrl: './game-info.html',
})
export class GameInfo {
  title = input('Game Info');
  items = input<GameInfoItem[]>([]);

  radius = BORDER_RADIUS;
}
