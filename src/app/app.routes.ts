import { Routes } from '@angular/router';
import { Landing } from './landing/landing';
import { OnlineGame } from './pages/online-game/online-game';

export const routes: Routes = [
  { path: '', component: Landing },
  { path: 'play/online', component: OnlineGame },
];
