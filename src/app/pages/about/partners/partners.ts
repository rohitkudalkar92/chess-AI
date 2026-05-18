import { Component } from '@angular/core';

import { BORDER_RADIUS } from '../../../shared/constants';
import { TEXTS } from '../../../shared/texts';

interface Client {
  name: string;
  logo: string;
}

@Component({
  selector: 'app-partners',
  templateUrl: './partners.html',
})
export class Partners {
  radius = BORDER_RADIUS;
  texts = TEXTS.partners;

  clients: Client[] = [
    { name: 'Tech Mahindra', logo: 'assets/clients/tech-mahindra.png' },
    { name: 'Titan', logo: 'assets/clients/titan.png' },
    { name: 'Analytics India', logo: 'assets/clients/analytics-india.png' },
    { name: 'ChessBase', logo: 'assets/clients/chess-base.jpg' },
    { name: 'Circle Chess', logo: 'assets/clients/circle-chess.jpg' },
    { name: 'Cuppanord', logo: 'assets/clients/cuppanord.png' },
    { name: 'UA', logo: 'assets/clients/ua-logo.png' },
    { name: 'Client', logo: 'assets/clients/client-logo.jpg' },
    { name: 'Partner', logo: 'assets/clients/client-3.png' },
    { name: 'Partner', logo: 'assets/clients/client-4.png' },
  ];
}
