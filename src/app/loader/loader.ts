import { Component, signal, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-loader',
  imports: [],
  templateUrl: './loader.html',
  styleUrl: './loader.scss',
})
export class Loader implements OnInit, OnDestroy {
  private _pieces = [
    'assets/icons/white-king.svg',
    'assets/icons/white-queen.svg',
    'assets/icons/white-rook.svg',
    'assets/icons/white-bishop.svg',
    'assets/icons/white-knight.svg',
    'assets/icons/white-pawn.svg',
  ];
  private _index = 0;
  private _interval: ReturnType<typeof setInterval> | null = null;

  currentPiece = signal(this._pieces[0]);

  ngOnInit() {
    this._interval = setInterval(() => {
      this._index = (this._index + 1) % this._pieces.length;
      this.currentPiece.set(this._pieces[this._index]);
    }, 500);
  }

  ngOnDestroy() {
    if (this._interval) clearInterval(this._interval);
  }
}
