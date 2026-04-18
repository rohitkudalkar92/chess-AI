import { PieceType, Variant } from '../enums';

export interface Position {
  row: number;
  col: number;
}

export interface ChessPiece {
  color: Variant;
  type: PieceType;
}

export interface GameInfoItem {
  icon: string;
  label: string;
}

export interface Move {
  number: number;
  white: string;
  black?: string;
}
