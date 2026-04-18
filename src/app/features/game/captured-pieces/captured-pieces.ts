import { Component, input } from '@angular/core';

import { ChessPiece } from '../../../shared/interfaces';
import { BORDER_RADIUS } from '../../../shared/constants';

@Component({
  selector: 'app-captured-pieces',
  templateUrl: './captured-pieces.html',
})
export class CapturedPieces {
  label = input('Captured');
  pieces = input<ChessPiece[]>([]);

  radius = BORDER_RADIUS;

  getPieceImage(piece: ChessPiece): string {
    return `assets/board/${piece.color}-${piece.type}.svg`;
  }
}
