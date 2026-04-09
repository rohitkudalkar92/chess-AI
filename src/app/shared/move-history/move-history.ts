import { Component, input } from '@angular/core';

import { Move } from '../interfaces';
import { BORDER_RADIUS } from '../constants';

@Component({
  selector: 'app-move-history',
  templateUrl: './move-history.html',
})
export class MoveHistory {
  moves = input<Move[]>([]);
  radius = BORDER_RADIUS;
}
