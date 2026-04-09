import { Component, Output, EventEmitter } from '@angular/core';

import { Button } from '../button/button';
import { Variant, ButtonSize } from '../enums';

@Component({
  selector: 'app-game-controls',
  imports: [Button],
  templateUrl: './game-controls.html',
})
export class GameControls {
  Variant = Variant;
  ButtonSize = ButtonSize;

  @Output() resign = new EventEmitter<void>();
  @Output() drawOffer = new EventEmitter<void>();
  @Output() rematch = new EventEmitter<void>();
}
