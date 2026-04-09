import { Component, signal, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './navbar/navbar';
import { Loader } from './loader/loader';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, Loader],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  loading = signal(true);

  ngOnInit() {
    setTimeout(() => this.loading.set(false), 2500);
  }
}
