import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { CityService } from '../../shared/services/city.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterOutlet],
  templateUrl: './header.component.html',
  styleUrl: './header.component.less'
})
export class HeaderComponent {
  title = 'weather-insight-front';
  cities:any = [];
  currentCity;

  constructor(private citiesService: CityService, private router: Router) {

  }

  ngOnInit() {
    this.currentCity = this.citiesService.selectedCity;
    this.cities = this.citiesService.cities;
  }

  changeCity(event) {
    let city = event.target.value;
    this.citiesService.selectedCity = city;
    this.router.navigate([city, "/today"]);
  }
}
