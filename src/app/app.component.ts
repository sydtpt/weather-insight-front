import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive, RouterModule, RouterOutlet } from '@angular/router';
import { CityService } from './shared/services/city.service';
import { HttpClientModule } from '@angular/common/http';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule,HttpClientModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrl: './app.component.less'
})
export class AppComponent {
  hasCitySelected = false;
  title = 'weather-insight-front';
  private route = inject(ActivatedRoute);

  constructor(private cityService: CityService, private router: Router ) {

  }
  ngOnInit(){
    let urlsData = window.location.href.split("/").filter(e => e);
    if(urlsData.length > 2 && this.cityService.exist(urlsData[2])) {
        this.cityService.selectedCity = urlsData[2];
        this.hasCitySelected = true;
    } else {
      this.router.navigateByUrl("/");
      this.hasCitySelected = false;
    }
  }
}
