import { Component, computed, input, signal } from '@angular/core';

import { Variant, TooltipPosition, TooltipTrigger } from '../enums';
import { BORDER_RADIUS } from '../constants';

@Component({
  selector: 'app-tooltip',
  templateUrl: './tooltip.html',
})
export class Tooltip {
  radius = BORDER_RADIUS;

  // Inputs
  text = input<string>('');
  position = input<TooltipPosition>(TooltipPosition.Top);
  trigger = input<TooltipTrigger>(TooltipTrigger.Hover);
  variant = input<Variant>(Variant.Black);
  showTooltip = input<boolean | undefined>(undefined);

  // Private properties
  _internalVisible = signal(false);

  // Getters
  get isVisible(): boolean {
    return this.showTooltip() !== undefined ? this.showTooltip()! : this._internalVisible();
  }

  get isParentControlled(): boolean {
    return this.showTooltip() !== undefined;
  }

  // Public methods
  show(): void {
    if (!this.isParentControlled) this._internalVisible.set(true);
  }

  hide(): void {
    if (!this.isParentControlled) this._internalVisible.set(false);
  }

  get isHoverTrigger(): boolean {
    return this.trigger() === TooltipTrigger.Hover || this.trigger() === TooltipTrigger.Both;
  }

  get isFocusTrigger(): boolean {
    return this.trigger() === TooltipTrigger.Focus || this.trigger() === TooltipTrigger.Both;
  }

  get positionClasses(): string {
    const positions: Record<string, string> = {
      top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
      bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
      left: 'right-full top-1/2 -translate-y-1/2 mr-2',
      right: 'left-full top-1/2 -translate-y-1/2 ml-2',
    };
    return positions[this.position()];
  }

  get variantClasses(): string {
    const variants: Record<string, string> = {
      black: 'bg-gray-900 text-white',
      white: 'bg-white text-gray-900 border border-gray-200',
    };
    return variants[this.variant()];
  }

  get arrowClasses(): string {
    const isWhite = this.variant() === Variant.White;
    const color = isWhite ? 'white' : 'gray-900';
    const arrows: Record<string, string> = {
      top: `top-full left-1/2 -translate-x-1/2 border-t-${color} border-x-transparent border-b-transparent`,
      bottom: `bottom-full left-1/2 -translate-x-1/2 border-b-${color} border-x-transparent border-t-transparent`,
      left: `left-full top-1/2 -translate-y-1/2 border-l-${color} border-y-transparent border-r-transparent`,
      right: `right-full top-1/2 -translate-y-1/2 border-r-${color} border-y-transparent border-l-transparent`,
    };
    return arrows[this.position()];
  }
}
