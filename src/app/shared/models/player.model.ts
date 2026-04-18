import { Variant } from '../enums';

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
