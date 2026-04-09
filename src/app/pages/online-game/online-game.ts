import { Component } from '@angular/core';

import { ChessBoard } from '../../shared/chess-board/chess-board';
import { PlayerCard } from '../../shared/player-card/player-card';
import { MoveHistory } from '../../shared/move-history/move-history';
import { GameControls } from '../../shared/game-controls/game-controls';
import { GameInfo } from '../../shared/game-info/game-info';
import { Player, Move, GameInfoItem } from '../../shared/interfaces';
import { Variant } from '../../shared/enums';

@Component({
  selector: 'app-online-game',
  imports: [ChessBoard, PlayerCard, MoveHistory, GameControls, GameInfo],
  templateUrl: './online-game.html',
})
export class OnlineGame {
  gameInfoItems: GameInfoItem[] = [
    { icon: '⏱', label: 'Rapid · 15 min' },
    { icon: '🌐', label: 'Online Match' },
    { icon: '🔴', label: 'Live' },
  ];

  opponent: Player = {
    name: 'Magnus_AI',
    rating: 2200,
    avatar: 'assets/users/chess-user.svg',
    color: Variant.Black,
    stats: { wins: 142, losses: 31, draws: 18 },
  };

  player: Player = {
    name: 'You',
    rating: 1500,
    avatar: 'assets/users/chess-user.svg',
    color: Variant.White,
    stats: { wins: 87, losses: 45, draws: 12 },
  };

  moves: Move[] = [
    { number: 1, white: 'e4', black: 'e5' },
    { number: 2, white: 'Nf3', black: 'Nc6' },
    { number: 3, white: 'Bb5', black: 'a6' },
    { number: 4, white: 'Ba4', black: 'Nf6' },
    { number: 5, white: 'O-O' },
  ];

  onResign(): void {
    console.log('Resigned');
  }

  onDrawOffer(): void {
    console.log('Draw offered');
  }

  onRematch(): void {
    console.log('Rematch requested');
  }
}
