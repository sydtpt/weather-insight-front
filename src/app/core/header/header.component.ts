import { Component, effect, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CitiesStore } from '../../store/cities.store';
import { patchState } from '@ngrx/signals';
import { RawDataStore } from '../../store/raw-data/raw-data.store';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterOutlet],
  templateUrl: './header.component.html',
  styleUrl: './header.component.less'
})
export class HeaderComponent {
  citiesStore = inject(CitiesStore);
  rawDataStore = inject(RawDataStore);
  constructor(private location: Location) {
  }

  changeCity(event) {
    let city_code = event.target.value;
    let city = this.citiesStore.getCityByCode(city_code);
    patchState(this.citiesStore, {selectedCity: city});
    patchState(this.rawDataStore, {isLoading: true, city: city});
    this.location.replaceState(`${city?.city_code}/today`);
  }
}
