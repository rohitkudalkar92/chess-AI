import { Component } from '@angular/core';

import { ChessPiece } from '../interfaces';
import { PieceType, Variant } from '../enums';
import { BORDER_RADIUS } from '../constants';

type BoardCell = ChessPiece | null;

@Component({
  selector: 'app-chess-board',
  templateUrl: './chess-board.html',
})
export class ChessBoard {
  radius = BORDER_RADIUS;
  board: BoardCell[][] = this._initBoard();
  files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  ranks = [8, 7, 6, 5, 4, 3, 2, 1];

  get boardClasses(): string {
    return `inline-block overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700 ${this.radius.md}`;
  }

  get cellBaseClasses(): string {
    return 'w-26 h-26 flex items-center justify-center relative select-none cursor-pointer hover:ring-2 hover:ring-amber-400 hover:ring-inset transition-all';
  }

  cellClasses(row: number, col: number): string {
    return `${this.cellBaseClasses} ${this.isLight(row, col) ? 'bg-amber-100 dark:bg-amber-200/80' : 'bg-amber-800 dark:bg-amber-900'}`;
  }

  labelClasses(row: number, col: number): string {
    return `absolute text-[10px] font-medium ${this.isLight(row, col) ? 'text-amber-800/50' : 'text-amber-100/50'}`;
  }

  isLight(row: number, col: number): boolean {
    return (row + col) % 2 === 0;
  }

  getPieceImage(piece: ChessPiece): string {
    return `assets/board/${piece.color}-${piece.type}.svg`;
  }

  private _initBoard(): BoardCell[][] {
    const board: BoardCell[][] = Array.from({ length: 8 }, () => Array(8).fill(null));

    const backRow: PieceType[] = [
      PieceType.Rook, PieceType.Knight, PieceType.Bishop, PieceType.Queen,
      PieceType.King, PieceType.Bishop, PieceType.Knight, PieceType.Rook,
    ];

    for (let col = 0; col < 8; col++) {
      board[0][col] = { color: Variant.Black, type: backRow[col] };
      board[1][col] = { color: Variant.Black, type: PieceType.Pawn };
      board[6][col] = { color: Variant.White, type: PieceType.Pawn };
      board[7][col] = { color: Variant.White, type: backRow[col] };
    }

    return board;
  }
}
