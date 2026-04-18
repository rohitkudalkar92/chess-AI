import { Component, input, Output, EventEmitter } from '@angular/core';

import { Button } from '../button/button';
import { Variant, ButtonSize } from '../../enums';
import { BORDER_RADIUS } from '../../constants';

@Component({
  selector: 'app-confirm-modal',
  imports: [Button],
  templateUrl: './confirm-modal.html',
})
export class ConfirmModal {
  Variant = Variant;
  ButtonSize = ButtonSize;
  radius = BORDER_RADIUS;

  icon = input('⚠️');
  iconType = input<'emoji' | 'image'>('emoji');
  title = input('Are you sure?');
  message = input('');
  confirmLabel = input('Confirm');
  cancelLabel = input('Cancel');

  @Output() confirmed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  get overlayClasses(): string {
    return 'fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm';
  }

  get panelClasses(): string {
    return `bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-2xl w-full max-w-sm mx-4 p-6 flex flex-col items-center gap-4 ${this.radius.md}`;
  }

  onOverlayClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.cancelled.emit();
    }
  }
}
