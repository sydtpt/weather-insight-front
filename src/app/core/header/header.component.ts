import { Component, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CitiesStore } from '../../store/cities.store';
import { patchState } from '@ngrx/signals';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterOutlet],
  templateUrl: './header.component.html',
  styleUrl: './header.component.less'
})
export class HeaderComponent {
  citiesStore = inject(CitiesStore);

  constructor(private router: Router) {
  }

  changeCity(event) {
    let city = event.target.value;
    patchState(this.citiesStore, {selectedCity: city});
    // this.citiesService.selectedCity = city;
    this.router.navigate([city, "/today"]);
  }
}
