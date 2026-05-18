import { Component, signal, OnInit, inject } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { filter, map } from 'rxjs';
import { Navbar } from './layout/navbar/navbar';
import { Footer } from './layout/footer/footer';
import { Loader } from './layout/loader/loader';
import { TEXTS } from './shared/texts';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, Footer, Loader],
  templateUrl: './app.html',
})
export class App implements OnInit {
  private _title = inject(Title);
  private _meta = inject(Meta);
  private _router = inject(Router);
  private _route = inject(ActivatedRoute);

  loading = signal(true);

  ngOnInit() {
    this._title.setTitle(TEXTS.app.name);
    setTimeout(() => this.loading.set(false), 2500);

    this._router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => {
        let route = this._route;
        while (route.firstChild) route = route.firstChild;
        return route.snapshot.data;
      })
    ).subscribe(data => {
      window.scrollTo(0, 0);
      if (data['description']) {
        this._meta.updateTag({ name: 'description', content: data['description'] });
        this._meta.updateTag({ property: 'og:description', content: data['description'] });
      }
    });
  }
}
