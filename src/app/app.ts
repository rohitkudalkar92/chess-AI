import { Component, signal, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './layout/navbar/navbar';
import { Loader } from './layout/loader/loader';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, Loader],
  templateUrl: './app.html',
})
export class App implements OnInit {
  loading = signal(true);

  ngOnInit() {
    setTimeout(() => this.loading.set(false), 2500);
  }
}
