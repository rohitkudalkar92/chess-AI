import { Injectable, signal } from '@angular/core';

import { ChessPiece, Position, Move } from '../interfaces';
import { PieceType, Variant } from '../enums';

type BoardCell = ChessPiece | null;

interface CastlingRights {
  whiteKing: boolean;
  whiteQueenside: boolean;
  whiteKingside: boolean;
  blackKing: boolean;
  blackQueenside: boolean;
  blackKingside: boolean;
}

@Injectable({ providedIn: 'root' })
export class GameService {
  board = signal<BoardCell[][]>(this._initBoard());
  currentTurn = signal<Variant>(Variant.White);
  selectedPosition = signal<Position | null>(null);
  validMoves = signal<Position[]>([]);
  inCheck = signal<Variant | null>(null);
  gameOver = signal<'checkmate' | 'stalemate' | 'repetition' | 'fifty-move' | 'insufficient' | 'timeout' | null>(null);
  winner = signal<Variant | null>(null);
  pendingPromotion = signal<Position | null>(null);
  moveHistory = signal<Move[]>([]);
  capturedByWhite = signal<ChessPiece[]>([]);
  capturedByBlack = signal<ChessPiece[]>([]);
  lastMove = signal<{ from: Position; to: Position } | null>(null);

  private _files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  private _pendingMoveNotation: string | null = null;

  private _positionHistory: Map<string, number> = new Map();
  private _halfMoveClock = 0;
  private _enPassantTarget: Position | null = null;

  constructor() {
    const hash = this._boardHash(this._initBoard(), Variant.White);
    this._positionHistory.set(hash, 1);
  }
  private _moveSound = new Audio('assets/mp3/move.mp3');
  private _castling: CastlingRights = {
    whiteKing: false, whiteQueenside: false, whiteKingside: false,
    blackKing: false, blackQueenside: false, blackKingside: false,
  };

  endByTimeout(loser: Variant): void {
    this.gameOver.set('timeout');
    this.winner.set(loser === Variant.White ? Variant.Black : Variant.White);
  }

  selectCell(row: number, col: number): void {
    if (this.gameOver() || this.pendingPromotion()) return;

    const board = this.board();
    const piece = board[row][col];
    const selected = this.selectedPosition();

    if (selected && this._isValidMove(row, col)) {
      this._movePiece(selected, { row, col });
      return;
    }

    if (piece && piece.color === this.currentTurn()) {
      this.selectedPosition.set({ row, col });
      this.validMoves.set(this._getValidMoves(row, col, piece));
    } else {
      this._clearSelection();
    }
  }

  isSelected(row: number, col: number): boolean {
    const s = this.selectedPosition();
    return s !== null && s.row === row && s.col === col;
  }

  isValidMove(row: number, col: number): boolean {
    return this._isValidMove(row, col);
  }

  isKingInCheck(row: number, col: number): boolean {
    const board = this.board();
    const piece = board[row][col];
    return piece !== null && piece.type === PieceType.King && this.inCheck() === piece.color;
  }

  promote(type: PieceType): void {
    const pos = this.pendingPromotion();
    if (!pos) return;
    const board = this.board().map(r => [...r]);
    const color = board[pos.row][pos.col]!.color;
    board[pos.row][pos.col] = { color, type };
    this.board.set(board);
    this.pendingPromotion.set(null);
    const notation = (this._pendingMoveNotation ?? '') + '=' + this._pieceSymbol(type);
    this._pendingMoveNotation = null;
    this._recordMove(notation, color);
    this._finishTurn(board);
  }

  private _isValidMove(row: number, col: number): boolean {
    return this.validMoves().some(m => m.row === row && m.col === col);
  }

  private _movePiece(from: Position, to: Position): void {
    const board = this.board().map(r => [...r]);
    const piece = board[from.row][from.col]!;

    // En passant capture
    let isCapture = board[to.row][to.col] !== null;
    let capturedPiece = board[to.row][to.col];
    if (piece.type === PieceType.Pawn && this._enPassantTarget &&
        to.row === this._enPassantTarget.row && to.col === this._enPassantTarget.col) {
      capturedPiece = board[from.row][to.col];
      board[from.row][to.col] = null;
      isCapture = true;
    }

    if (capturedPiece) {
      if (piece.color === Variant.White) {
        this.capturedByWhite.update(c => [...c, capturedPiece]);
      } else {
        this.capturedByBlack.update(c => [...c, capturedPiece]);
      }
    }

    // Track en passant target
    if (piece.type === PieceType.Pawn && Math.abs(to.row - from.row) === 2) {
      this._enPassantTarget = { row: (from.row + to.row) / 2, col: from.col };
    } else {
      this._enPassantTarget = null;
    }

    // Castling move
    let isCastleKingside = false;
    let isCastleQueenside = false;
    if (piece.type === PieceType.King && Math.abs(to.col - from.col) === 2) {
      const isKingside = to.col > from.col;
      isCastleKingside = isKingside;
      isCastleQueenside = !isKingside;
      const rookFromCol = isKingside ? 7 : 0;
      const rookToCol = isKingside ? 5 : 3;
      board[from.row][rookToCol] = board[from.row][rookFromCol];
      board[from.row][rookFromCol] = null;
    }

    // Update castling rights (piece moved + rook captured)
    this._updateCastlingRights(piece, from);
    if (capturedPiece?.type === PieceType.Rook) {
      this._revokeCastlingOnCapture(to);
    }

    // 50-move rule clock
    if (piece.type === PieceType.Pawn || isCapture) {
      this._halfMoveClock = 0;
    } else {
      this._halfMoveClock++;
    }

    board[to.row][to.col] = piece;
    board[from.row][from.col] = null;
    this.lastMove.set({ from, to });
    this.board.set(board);

    // Pawn promotion — store notation prefix, complete in promote()
    const promoRow = piece.color === Variant.White ? 0 : 7;
    if (piece.type === PieceType.Pawn && to.row === promoRow) {
      this._pendingMoveNotation = this._toNotation(piece, from, to, isCapture, false, false);
      this.pendingPromotion.set(to);
      this._clearSelection();
      return;
    }

    const notation = this._toNotation(piece, from, to, isCapture, isCastleKingside, isCastleQueenside);
    this._recordMove(notation, piece.color);
    this._finishTurn(board);
  }

  private _updateCastlingRights(piece: ChessPiece, from: Position): void {
    if (piece.type === PieceType.King) {
      if (piece.color === Variant.White) {
        this._castling.whiteKing = true;
      } else {
        this._castling.blackKing = true;
      }
    }
    if (piece.type === PieceType.Rook) {
      if (piece.color === Variant.White) {
        if (from.col === 0) this._castling.whiteQueenside = true;
        if (from.col === 7) this._castling.whiteKingside = true;
      } else {
        if (from.col === 0) this._castling.blackQueenside = true;
        if (from.col === 7) this._castling.blackKingside = true;
      }
    }
  }

  private _revokeCastlingOnCapture(pos: Position): void {
    if (pos.row === 7 && pos.col === 0) this._castling.whiteQueenside = true;
    if (pos.row === 7 && pos.col === 7) this._castling.whiteKingside = true;
    if (pos.row === 0 && pos.col === 0) this._castling.blackQueenside = true;
    if (pos.row === 0 && pos.col === 7) this._castling.blackKingside = true;
  }

  private _finishTurn(board: BoardCell[][]): void {
    this._moveSound.currentTime = 0;
    this._moveSound.play();
    const nextTurn = this.currentTurn() === Variant.White ? Variant.Black : Variant.White;
    this.currentTurn.set(nextTurn);

    const check = this._isInCheck(board, nextTurn);
    this.inCheck.set(check ? nextTurn : null);
    this._checkGameOver(board, nextTurn);

    // Check threefold repetition
    if (!this.gameOver()) {
      const hash = this._boardHash(board, nextTurn);
      const count = (this._positionHistory.get(hash) ?? 0) + 1;
      this._positionHistory.set(hash, count);
      if (count >= 3) {
        this.gameOver.set('repetition');
      }
    }

    // Check 50-move rule
    if (!this.gameOver() && this._halfMoveClock >= 100) {
      this.gameOver.set('fifty-move');
    }

    // Check insufficient material
    if (!this.gameOver() && this._isInsufficientMaterial(board)) {
      this.gameOver.set('insufficient');
    }

    // Append + or # to last move notation
    if (check || this.gameOver()) {
      const history = this.moveHistory();
      if (history.length > 0) {
        const updated = [...history];
        const last = { ...updated[updated.length - 1] };
        const suffix = this.gameOver() === 'checkmate' ? '#' : '+';
        if (last.black) {
          last.black += suffix;
        } else {
          last.white += suffix;
        }
        updated[updated.length - 1] = last;
        this.moveHistory.set(updated);
      }
    }

    this._clearSelection();
  }

  private _recordMove(notation: string, color: Variant): void {
    const history = [...this.moveHistory()];
    if (color === Variant.White) {
      history.push({ number: history.length + 1, white: notation });
    } else if (history.length > 0) {
      const last = { ...history[history.length - 1] };
      last.black = notation;
      history[history.length - 1] = last;
    }
    this.moveHistory.set(history);
  }

  private _toNotation(piece: ChessPiece, from: Position, to: Position, capture: boolean, castleK: boolean, castleQ: boolean): string {
    if (castleK) return 'O-O';
    if (castleQ) return 'O-O-O';

    const dest = this._files[to.col] + (8 - to.row);

    if (piece.type === PieceType.Pawn) {
      return capture ? `${this._files[from.col]}x${dest}` : dest;
    }

    const symbol = this._pieceSymbol(piece.type);
    return `${symbol}${capture ? 'x' : ''}${dest}`;
  }

  private _pieceSymbol(type: PieceType): string {
    const symbols: Record<string, string> = {
      king: 'K', queen: 'Q', rook: 'R', bishop: 'B', knight: 'N', pawn: '',
    };
    return symbols[type] ?? '';
  }

  private _clearSelection(): void {
    this.selectedPosition.set(null);
    this.validMoves.set([]);
  }

  private _checkGameOver(board: BoardCell[][], color: Variant): void {
    if (!this._hasAnyLegalMove(board, color)) {
      if (this._isInCheck(board, color)) {
        this.gameOver.set('checkmate');
        this.winner.set(color === Variant.White ? Variant.Black : Variant.White);
      } else {
        this.gameOver.set('stalemate');
      }
    }
  }

  private _hasAnyLegalMove(board: BoardCell[][], color: Variant): boolean {
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const piece = board[r][c];
        if (piece && piece.color === color) {
          if (this._getValidMoves(r, c, piece).length > 0) return true;
        }
      }
    }
    return false;
  }

  private _getValidMoves(row: number, col: number, piece: ChessPiece): Position[] {
    const raw = this._getRawMoves(row, col, piece);
    return raw.filter(move => {
      const simulated = this.board().map(r => [...r]);

      // Simulate en passant capture
      if (piece.type === PieceType.Pawn && this._enPassantTarget &&
          move.row === this._enPassantTarget.row && move.col === this._enPassantTarget.col) {
        simulated[row][move.col] = null;
      }

      // Simulate castling rook move
      if (piece.type === PieceType.King && Math.abs(move.col - col) === 2) {
        const isKingside = move.col > col;
        const rookFromCol = isKingside ? 7 : 0;
        const rookToCol = isKingside ? 5 : 3;
        simulated[row][rookToCol] = simulated[row][rookFromCol];
        simulated[row][rookFromCol] = null;
      }

      simulated[move.row][move.col] = simulated[row][col];
      simulated[row][col] = null;
      return !this._isInCheck(simulated, piece.color);
    });
  }

  private _getRawMoves(row: number, col: number, piece: ChessPiece): Position[] {
    switch (piece.type) {
      case PieceType.Pawn: return this._getPawnMoves(row, col, piece.color);
      case PieceType.Knight: return this._getKnightMoves(row, col, piece.color);
      case PieceType.Bishop: return this._getSlidingMoves(row, col, piece.color, [[-1, -1], [-1, 1], [1, -1], [1, 1]]);
      case PieceType.Rook: return this._getSlidingMoves(row, col, piece.color, [[-1, 0], [1, 0], [0, -1], [0, 1]]);
      case PieceType.Queen: return this._getSlidingMoves(row, col, piece.color, [[-1, -1], [-1, 1], [1, -1], [1, 1], [-1, 0], [1, 0], [0, -1], [0, 1]]);
      case PieceType.King: return this._getKingMoves(row, col, piece.color);
      default: return [];
    }
  }

  // --- Check detection ---

  private _isInCheck(board: BoardCell[][], color: Variant): boolean {
    const kingPos = this._findKing(board, color);
    if (!kingPos) return false;
    const enemy = color === Variant.White ? Variant.Black : Variant.White;

    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const piece = board[r][c];
        if (piece && piece.color === enemy) {
          const attacks = this._getRawMovesOnBoard(board, r, c, piece);
          if (attacks.some(m => m.row === kingPos.row && m.col === kingPos.col)) return true;
        }
      }
    }
    return false;
  }

  private _isSquareAttacked(board: BoardCell[][], row: number, col: number, byColor: Variant): boolean {
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const piece = board[r][c];
        if (piece && piece.color === byColor) {
          const attacks = this._getRawMovesOnBoard(board, r, c, piece);
          if (attacks.some(m => m.row === row && m.col === col)) return true;
        }
      }
    }
    return false;
  }

  private _findKing(board: BoardCell[][], color: Variant): Position | null {
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const piece = board[r][c];
        if (piece && piece.type === PieceType.King && piece.color === color) return { row: r, col: c };
      }
    }
    return null;
  }

  private _getRawMovesOnBoard(board: BoardCell[][], row: number, col: number, piece: ChessPiece): Position[] {
    switch (piece.type) {
      case PieceType.Pawn: return this._getPawnAttacks(row, col, piece.color);
      case PieceType.Knight: return this._getKnightMovesOnBoard(board, row, col, piece.color);
      case PieceType.Bishop: return this._getSlidingMovesOnBoard(board, row, col, piece.color, [[-1, -1], [-1, 1], [1, -1], [1, 1]]);
      case PieceType.Rook: return this._getSlidingMovesOnBoard(board, row, col, piece.color, [[-1, 0], [1, 0], [0, -1], [0, 1]]);
      case PieceType.Queen: return this._getSlidingMovesOnBoard(board, row, col, piece.color, [[-1, -1], [-1, 1], [1, -1], [1, 1], [-1, 0], [1, 0], [0, -1], [0, 1]]);
      case PieceType.King: return this._getKingMovesRaw(row, col);
      default: return [];
    }
  }

  // --- Piece move generators ---

  private _getPawnMoves(row: number, col: number, color: Variant): Position[] {
    const moves: Position[] = [];
    const board = this.board();
    const direction = color === Variant.White ? -1 : 1;
    const startRow = color === Variant.White ? 6 : 1;
    const nextRow = row + direction;

    if (!this._inBounds(nextRow)) return moves;

    // Forward 1
    if (!board[nextRow][col]) {
      moves.push({ row: nextRow, col });
      // Forward 2 from start
      const twoAhead = row + direction * 2;
      if (row === startRow && this._inBounds(twoAhead) && !board[twoAhead][col]) {
        moves.push({ row: twoAhead, col });
      }
    }

    // Diagonal capture + en passant
    for (const dc of [-1, 1]) {
      const nc = col + dc;
      if (this._inBounds(nextRow) && nc >= 0 && nc < 8) {
        const target = board[nextRow][nc];
        if (target && target.color !== color) {
          moves.push({ row: nextRow, col: nc });
        }
        // En passant
        if (this._enPassantTarget && this._enPassantTarget.row === nextRow && this._enPassantTarget.col === nc) {
          moves.push({ row: nextRow, col: nc });
        }
      }
    }

    return moves;
  }

  private _getPawnAttacks(row: number, col: number, color: Variant): Position[] {
    const direction = color === Variant.White ? -1 : 1;
    const nextRow = row + direction;
    if (nextRow < 0 || nextRow > 7) return [];
    const attacks: Position[] = [];
    if (col > 0) attacks.push({ row: nextRow, col: col - 1 });
    if (col < 7) attacks.push({ row: nextRow, col: col + 1 });
    return attacks;
  }

  private _getKnightMoves(row: number, col: number, color: Variant): Position[] {
    return this._getKnightMovesOnBoard(this.board(), row, col, color);
  }

  private _getKnightMovesOnBoard(board: BoardCell[][], row: number, col: number, color: Variant): Position[] {
    const offsets = [[-2, -1], [-2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2], [2, -1], [2, 1]];
    return offsets
      .map(([dr, dc]) => ({ row: row + dr, col: col + dc }))
      .filter(p => p.row >= 0 && p.row < 8 && p.col >= 0 && p.col < 8)
      .filter(p => !board[p.row][p.col] || board[p.row][p.col]!.color !== color);
  }

  private _getKingMoves(row: number, col: number, color: Variant): Position[] {
    const board = this.board();
    const moves = this._getKingMovesRaw(row, col)
      .filter(p => !board[p.row][p.col] || board[p.row][p.col]!.color !== color);

    // Castling
    const enemy = color === Variant.White ? Variant.Black : Variant.White;
    const kingRow = color === Variant.White ? 7 : 0;
    const kingMoved = color === Variant.White ? this._castling.whiteKing : this._castling.blackKing;

    if (!kingMoved && row === kingRow && col === 4 && !this._isSquareAttacked(board, row, col, enemy)) {
      const kingsideRookMoved = color === Variant.White ? this._castling.whiteKingside : this._castling.blackKingside;
      if (!kingsideRookMoved && board[kingRow][7]?.type === PieceType.Rook && board[kingRow][7]?.color === color) {
        if (!board[kingRow][5] && !board[kingRow][6] &&
            !this._isSquareAttacked(board, kingRow, 5, enemy) &&
            !this._isSquareAttacked(board, kingRow, 6, enemy)) {
          moves.push({ row: kingRow, col: 6 });
        }
      }

      const queensideRookMoved = color === Variant.White ? this._castling.whiteQueenside : this._castling.blackQueenside;
      if (!queensideRookMoved && board[kingRow][0]?.type === PieceType.Rook && board[kingRow][0]?.color === color) {
        if (!board[kingRow][1] && !board[kingRow][2] && !board[kingRow][3] &&
            !this._isSquareAttacked(board, kingRow, 2, enemy) &&
            !this._isSquareAttacked(board, kingRow, 3, enemy)) {
          moves.push({ row: kingRow, col: 2 });
        }
      }
    }

    return moves;
  }

  private _getKingMovesRaw(row: number, col: number): Position[] {
    const offsets = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
    return offsets
      .map(([dr, dc]) => ({ row: row + dr, col: col + dc }))
      .filter(p => p.row >= 0 && p.row < 8 && p.col >= 0 && p.col < 8);
  }

  private _getSlidingMoves(row: number, col: number, color: Variant, directions: number[][]): Position[] {
    return this._getSlidingMovesOnBoard(this.board(), row, col, color, directions);
  }

  private _getSlidingMovesOnBoard(board: BoardCell[][], row: number, col: number, color: Variant, directions: number[][]): Position[] {
    const moves: Position[] = [];
    for (const [dr, dc] of directions) {
      let r = row + dr;
      let c = col + dc;
      while (r >= 0 && r < 8 && c >= 0 && c < 8) {
        const target = board[r][c];
        if (!target) {
          moves.push({ row: r, col: c });
        } else {
          if (target.color !== color) moves.push({ row: r, col: c });
          break;
        }
        r += dr;
        c += dc;
      }
    }
    return moves;
  }

  private _inBounds(row: number): boolean {
    return row >= 0 && row < 8;
  }

  private _isInsufficientMaterial(board: BoardCell[][]): boolean {
    const pieces: ChessPiece[] = [];
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        if (board[r][c]) pieces.push(board[r][c]!);
      }
    }

    // King vs King
    if (pieces.length === 2) return true;

    // King+Bishop vs King or King+Knight vs King
    if (pieces.length === 3) {
      return pieces.some(p => p.type === PieceType.Bishop || p.type === PieceType.Knight);
    }

    // King+Bishop vs King+Bishop (same color bishops)
    if (pieces.length === 4) {
      const bishops = pieces.filter(p => p.type === PieceType.Bishop);
      if (bishops.length === 2 && bishops[0].color !== bishops[1].color) {
        let pos1: Position | null = null;
        let pos2: Position | null = null;
        for (let r = 0; r < 8; r++) {
          for (let c = 0; c < 8; c++) {
            if (board[r][c]?.type === PieceType.Bishop) {
              if (!pos1) { pos1 = { row: r, col: c }; } else { pos2 = { row: r, col: c }; }
            }
          }
        }
        if (pos1 && pos2) {
          return (pos1.row + pos1.col) % 2 === (pos2.row + pos2.col) % 2;
        }
      }
    }

    return false;
  }

  private _boardHash(board: BoardCell[][], turn: Variant): string {
    let hash: string = turn;
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const p = board[r][c];
        hash += p ? `${p.color[0]}${p.type[0]}` : '--';
      }
    }
    hash += `${this._castling.whiteKing}${this._castling.whiteKingside}${this._castling.whiteQueenside}`;
    hash += `${this._castling.blackKing}${this._castling.blackKingside}${this._castling.blackQueenside}`;
    hash += this._enPassantTarget ? `${this._enPassantTarget.row}${this._enPassantTarget.col}` : 'xx';
    return hash;
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
