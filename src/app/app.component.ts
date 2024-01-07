import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CityService } from './shared/services/city.service';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule,HttpClientModule, FormsModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrl: './app.component.less'
})
export class AppComponent {
  hasCitySelected = false;
  title = 'weather-insight-front';

  constructor(private cityService: CityService, private router: Router ) {

  }
  ngOnInit(){
    let urlsData = window.location.href.split("/").filter(e => e);

    this.cityService.getCities()
      .subscribe(cities => {
        if(urlsData.length > 2 && this.cityService.exist(urlsData[2])) {
          this.cityService.selectedCity = urlsData[2];
          this.hasCitySelected = true;
        } else {
          this.router.navigateByUrl("/");
          this.hasCitySelected = false;
        }
      });
  }

  goToCityDashboard(city_code) {
      this.cityService.selectedCity = city_code;
    this.hasCitySelected = true;
    this.router.navigate(["/", city_code]);
  }
}
