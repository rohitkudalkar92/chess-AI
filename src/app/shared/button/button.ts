import { Component, input, Output, EventEmitter } from '@angular/core';
import { Variant, ButtonSize } from '../enums';
import { BORDER_RADIUS } from '../constants';

@Component({
  selector: 'app-button',
  templateUrl: './button.html',
  styles: ':host { display: inline-block; }',
})
export class Button {
  // Inputs
  variant = input<Variant>(Variant.Black);
  size = input<ButtonSize>(ButtonSize.Md);
  disabled = input(false);

  // Outputs
  @Output() clicked = new EventEmitter<void>();

  get classes(): string {
    const base = `font-semibold ${BORDER_RADIUS.sm} transition-all cursor-pointer inline-flex items-center justify-center`;

    const sizes: Record<string, string> = {
      sm: 'text-xs px-3 py-1.5',
      md: 'text-sm px-5 py-2',
      lg: 'text-base px-6 py-2.5',
    };

    const variants: Record<string, string> = {
      black: 'bg-gray-900 hover:bg-gray-800 text-white shadow-md shadow-black/20',
      white: 'bg-white hover:bg-gray-100 text-gray-900 shadow-md shadow-black/10',
    };

    const disabledStyle = this.disabled() ? 'opacity-50 pointer-events-none' : '';

    return `${base} ${sizes[this.size()]} ${variants[this.variant()]} ${disabledStyle}`;
  }
}
