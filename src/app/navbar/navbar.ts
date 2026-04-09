import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Button } from '../shared/button/button';
import { Variant } from '../shared/enums';
import { ThemeService } from '../shared/services/theme';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, Button],
  templateUrl: './navbar.html',
})
export class Navbar {
  Variant = Variant;
  themeService = inject(ThemeService);
}
