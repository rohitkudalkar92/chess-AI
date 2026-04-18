import { Component, Output, EventEmitter, inject, computed } from '@angular/core';

import { Button } from '../../../shared/components/button/button';
import { Variant, ButtonSize } from '../../../shared/enums';
import { ThemeService } from '../../../shared/services/theme';

@Component({
  selector: 'app-game-controls',
  imports: [Button],
  templateUrl: './game-controls.html',
})
export class GameControls {
  Variant = Variant;
  ButtonSize = ButtonSize;

  private _theme = inject(ThemeService);
  btnVariant = computed(() => this._theme.isDark() ? Variant.White : Variant.Black);

  @Output() resign = new EventEmitter<void>();
  @Output() drawOffer = new EventEmitter<void>();
  @Output() rematch = new EventEmitter<void>();
  @Output() flipBoard = new EventEmitter<void>();
}
