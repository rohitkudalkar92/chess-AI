import { Component, inject, signal } from '@angular/core';
import { ChessPiece } from '../../../shared/interfaces';
import { PieceType} from '../../../shared/enums';
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
  private _dragFrom: { row: number; col: number } | null = null;

  get board() { return this._game.board(); }
  get gameOver() { return this._game.gameOver(); }
  get winner() { return this._game.winner(); }
  get pendingPromotion() { return this._game.pendingPromotion(); }
  get lastMove() { return this._game.lastMove(); }

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
    const base = 'w-10 h-10 sm:w-14 sm:h-14 md:w-20 md:h-20 lg:w-26 lg:h-26 flex items-center justify-center relative select-none cursor-pointer transition-all';
    const square = this.isLight(row, col) ? 'bg-amber-100 dark:bg-amber-200/80' : 'bg-amber-800 dark:bg-amber-900';
    const lastMoveHighlight = this._isLastMoveSquare(row, col) ? 'ring-2 ring-inset ring-amber-300/60' : '';

    if (this._game.isKingInCheck(row, col)) {
      return `${base} ${square} ring-4 ring-inset ring-red-500`;
    }
    if (this._game.isSelected(row, col)) {
      return `${base} ${square} ring-4 ring-inset ring-amber-400`;
    }
    if (this._game.isValidMove(row, col)) {
      return `${base} ${square} ${lastMoveHighlight}`;
    }
    return `${base} ${square} ${lastMoveHighlight} hover:ring-2 hover:ring-amber-400 hover:ring-inset`;
  }

  labelClasses(row: number, col: number): string {
    return `absolute text-[10px] font-medium ${this.isLight(row, col) ? 'text-amber-800/50' : 'text-amber-100/50'}`;
  }

  pieceClasses(row: number, col: number): string {
    const base = 'w-7 h-7 sm:w-10 sm:h-10 md:w-14 md:h-14 lg:w-14 lg:h-14 drop-shadow-md';
    const capture = this.hasCapture(row, col) ? 'ring-4 ring-red-400 rounded-full' : '';
    const animate = this._isLastMoveTo(row, col) ? 'animate-piece-slide' : 'transition-transform hover:scale-110';
    return `${base} ${capture} ${animate}`;
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
    return `assets/board/${piece.color}-${piece.type}.svg`;
  }

  getPromotionImage(type: PieceType): string {
    const color = this.pendingPromotion
      ? this.board[this.pendingPromotion.row][this.pendingPromotion.col]?.color
      : 'white';
    return `assets/board/${color}-${type}.svg`;
  }

  // Click-click
  onCellClick(row: number, col: number): void {
    this._game.selectCell(row, col);
  }

  // Drag & drop
  onDragStart(event: DragEvent, row: number, col: number): void {
    const piece = this.board[row][col];
    if (!piece || piece.color !== this._game.currentTurn() || this.gameOver || this.pendingPromotion !== null) return;

    this._dragFrom = { row, col };
    this._game.selectCell(row, col);

    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
      const img = event.target as HTMLImageElement;
      event.dataTransfer.setDragImage(img, 28, 28);
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    if (event.dataTransfer) event.dataTransfer.dropEffect = 'move';
  }

  onDrop(event: DragEvent, row: number, col: number): void {
    event.preventDefault();
    if (this._dragFrom) {
      this._game.selectCell(row, col);
      this._dragFrom = null;
    }
  }

  onDragEnd(): void {
    this._dragFrom = null;
  }

  onPromote(type: PieceType): void {
    this._game.promote(type);
  }

  private _isLastMoveSquare(row: number, col: number): boolean {
    const lm = this.lastMove;
    if (!lm) return false;
    return (lm.from.row === row && lm.from.col === col) || (lm.to.row === row && lm.to.col === col);
  }

  private _isLastMoveTo(row: number, col: number): boolean {
    const lm = this.lastMove;
    return lm !== null && lm.to.row === row && lm.to.col === col;
  }
}
