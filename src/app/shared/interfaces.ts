import { PieceType, Variant } from './enums';

export interface NavLink {
  icon: string;
  label: string;
  route: string;
  hoverClass?: string;
}

export interface NavSection {
  title: string;
  links: NavLink[];
}

export interface NavMenu {
  label: string;
  cols: string;
  sections: NavSection[];
}

export interface PlayerStats {
  wins: number;
  losses: number;
  draws: number;
}

export interface Player {
  name: string;
  rating: number;
  avatar: string;
  color: Variant;
  stats: PlayerStats;
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
