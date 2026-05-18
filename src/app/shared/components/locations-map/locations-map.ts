import { Component, AfterViewInit, ElementRef, viewChild } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-locations-map',
  template: `<div #mapContainer class="w-full h-[450px]"></div>`,
})
export class LocationsMap implements AfterViewInit {
  private _mapContainer = viewChild.required<ElementRef>('mapContainer');

  private _locations = [
    // { city: 'Chennai', country: 'India', lat: 13.0827, lng: 80.2707, countryCode: 'in' },
    { city: 'Mumbai', country: 'India', lat: 19.076, lng: 72.8777, countryCode: 'in' },
    // { city: 'New Delhi', country: 'India', lat: 28.6139, lng: 77.209, countryCode: 'in' },
    { city: 'Singapore', country: 'Singapore', lat: 1.3521, lng: 103.8198, countryCode: 'sg' },
    { city: 'Dubai', country: 'UAE', lat: 25.2048, lng: 55.2708, countryCode: 'ae' },
    { city: 'Doha', country: 'Qatar', lat: 25.2854, lng: 51.531, countryCode: 'qa' },
    { city: 'Samarkand', country: 'Uzbekistan', lat: 39.6542, lng: 66.9597, countryCode: 'uz' },
    { city: 'London', country: 'UK', lat: 51.5074, lng: -0.1278, countryCode: 'gb' },
    { city: 'Stavanger', country: 'Norway', lat: 58.9699, lng: 5.7331, countryCode: 'no' },
  ];

  ngAfterViewInit() {
    const map = L.map(this._mapContainer().nativeElement, {
      center: [39.65, 66.96],
      zoom: 2.45,
      scrollWheelZoom: false,
      zoomControl: false,
      attributionControl: false,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    for (const loc of this._locations) {
      const flagIcon = L.divIcon({
        html: `<img src="https://flagcdn.com/w40/${loc.countryCode}.png" alt="${loc.country}" style="width:32px;height:22px;border-radius:3px;box-shadow:0 1px 3px rgba(0,0,0,0.3);" />`,
        className: '',
        iconSize: [32, 22],
        iconAnchor: [16, 11],
        popupAnchor: [0, -14],
      });

      L.marker([loc.lat, loc.lng], { icon: flagIcon })
        .addTo(map)
        .bindPopup(`<strong>${loc.city}</strong><br>${loc.country}`);
    }
  }
}
