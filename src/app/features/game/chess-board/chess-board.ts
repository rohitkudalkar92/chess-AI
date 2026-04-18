import { Component, inject, signal } from '@angular/core';

import { ChessPiece } from '../../../shared/interfaces';
import { PieceType } from '../../../shared/enums';
import { BORDER_RADIUS } from '../../../shared/constants';
import { GameService } from '../../../shared/services/game';

@Component({
  selector: 'app-chess-board',
  templateUrl: './chess-board.html',
})
export class ChessBoard {
  radius = BORDER_RADIUS;
  flipped = signal(false);

  private _game = inject(GameService);

  get board() { return this._game.board(); }
  get gameOver() { return this._game.gameOver(); }
  get winner() { return this._game.winner(); }
  get pendingPromotion() { return this._game.pendingPromotion(); }

  get displayRanks(): number[] {
    return this.flipped() ? [1, 2, 3, 4, 5, 6, 7, 8] : [8, 7, 6, 5, 4, 3, 2, 1];
  }

  get displayFiles(): string[] {
    return this.flipped() ? ['h', 'g', 'f', 'e', 'd', 'c', 'b', 'a'] : ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  }

  promotionPieces: PieceType[] = [PieceType.Queen, PieceType.Rook, PieceType.Bishop, PieceType.Knight];

  get boardClasses(): string {
    return `inline-block overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700 ${this.radius.md}`;
  }

  toggleFlip(): void {
    this.flipped.update(v => !v);
  }

  toRow(displayRowIndex: number): number {
    return this.flipped() ? 7 - displayRowIndex : displayRowIndex;
  }

  toCol(displayColIndex: number): number {
    return this.flipped() ? 7 - displayColIndex : displayColIndex;
  }

  cellClasses(row: number, col: number): string {
    const base = 'w-26 h-26 flex items-center justify-center relative select-none cursor-pointer transition-all';
    const square = this.isLight(row, col) ? 'bg-amber-100 dark:bg-amber-200/80' : 'bg-amber-800 dark:bg-amber-900';

    if (this._game.isKingInCheck(row, col)) {
      return `${base} ${square} ring-4 ring-inset ring-red-500`;
    }
    if (this._game.isSelected(row, col)) {
      return `${base} ${square} ring-4 ring-inset ring-amber-400`;
    }
    if (this._game.isValidMove(row, col)) {
      return `${base} ${square}`;
    }
    return `${base} ${square} hover:ring-2 hover:ring-amber-400 hover:ring-inset`;
  }

  labelClasses(row: number, col: number): string {
    return `absolute text-[10px] font-medium ${this.isLight(row, col) ? 'text-amber-800/50' : 'text-amber-100/50'}`;
  }

  isLight(row: number, col: number): boolean {
    return (row + col) % 2 === 0;
  }

  isValidMove(row: number, col: number): boolean {
    return this._game.isValidMove(row, col);
  }

  hasCapture(row: number, col: number): boolean {
    return this.isValidMove(row, col) && this.board[row][col] !== null;
  }

  getPieceImage(piece: ChessPiece): string {
    return `assets/icons/${piece.color}-${piece.type}.svg`;
  }

  getPromotionImage(type: PieceType): string {
    const color = this.pendingPromotion
      ? this.board[this.pendingPromotion.row][this.pendingPromotion.col]?.color
      : 'white';
    return `assets/icons/${color}-${type}.svg`;
  }

  onPromote(type: PieceType): void {
    this._game.promote(type);
  }

  onCellClick(row: number, col: number): void {
    this._game.selectCell(row, col);
  }
}
