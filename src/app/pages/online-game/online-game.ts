import { Component, signal, inject, viewChild, OnInit, OnDestroy } from '@angular/core';

import { ChessBoard } from '../../features/game/chess-board/chess-board';
import { PlayerCard } from '../../features/game/player-card/player-card';
import { MoveHistory } from '../../features/game/move-history/move-history';
import { GameControls } from '../../features/game/game-controls/game-controls';
import { GameInfo } from '../../features/game/game-info/game-info';
import { ConfirmModal } from '../../shared/components/confirm-modal/confirm-modal';
import { CapturedPieces } from '../../features/game/captured-pieces/captured-pieces';
import { Player, GameInfoItem } from '../../shared/interfaces';
import { Variant } from '../../shared/enums';
import { GameService } from '../../shared/services/game';

type ModalAction = 'resign' | 'draw' | 'rematch' | null;

interface ModalConfig {
  icon: string;
  iconType: 'emoji' | 'image';
  title: string;
  message: string;
  confirmLabel: string;
}

@Component({
  selector: 'app-online-game',
  imports: [ChessBoard, PlayerCard, MoveHistory, GameControls, GameInfo, ConfirmModal, CapturedPieces],
  templateUrl: './online-game.html',
})
export class OnlineGame implements OnInit, OnDestroy {
  private _game = inject(GameService);
  private _board = viewChild(ChessBoard);

  get moves() { return this._game.moveHistory(); }
  get capturedByWhite() { return this._game.capturedByWhite(); }
  get capturedByBlack() { return this._game.capturedByBlack(); }
  get isWhiteTurn() { return this._game.currentTurn() === Variant.White; }

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

  playerTime = signal(900);
  opponentTime = signal(900);
  activeModal = signal<ModalAction>(null);

  private _timerInterval: ReturnType<typeof setInterval> | null = null;

  private _modalConfigs: Record<string, ModalConfig> = {
    resign: { icon: '🏳️', iconType: 'emoji', title: 'Resign Game?', message: 'You will lose this game. This action cannot be undone.', confirmLabel: 'Resign' },
    draw: { icon: '🤝', iconType: 'emoji', title: 'Offer Draw?', message: 'Your opponent will be asked to accept or decline.', confirmLabel: 'Offer Draw' },
    rematch: { icon: '🔄', iconType: 'emoji', title: 'Request Rematch?', message: 'A new game will start with the same opponent.', confirmLabel: 'Rematch' },
  };

  get modalConfig(): ModalConfig | null {
    const action = this.activeModal();
    return action ? this._modalConfigs[action] : null;
  }

  ngOnInit(): void {
    this._timerInterval = setInterval(() => {
      if (this._game.gameOver()) return;

      if (this.isWhiteTurn) {
        this.playerTime.update(t => Math.max(0, t - 1));
      } else {
        this.opponentTime.update(t => Math.max(0, t - 1));
      }
    }, 1000);
  }

  ngOnDestroy(): void {
    if (this._timerInterval) clearInterval(this._timerInterval);
  }

  formatTime(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  }

  onFlipBoard(): void {
    this._board()?.toggleFlip();
  }

  openModal(action: ModalAction): void {
    this.activeModal.set(action);
  }

  closeModal(): void {
    this.activeModal.set(null);
  }

  confirmAction(): void {
    const action = this.activeModal();
    if (action === 'resign') console.log('Resigned');
    if (action === 'draw') console.log('Draw offered');
    if (action === 'rematch') console.log('Rematch requested');
    this.closeModal();
  }
}
