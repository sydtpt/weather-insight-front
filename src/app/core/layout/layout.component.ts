import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from "../header/header.component";
import { SideBarComponent } from "../side-bar/header/sidebar.component";
import { FooterComponent } from "../footer/footer.component";
import { CityService } from '../../shared/services/city.service';

@Component({
    selector: 'app-layout',
    standalone: true,
    templateUrl: './layout.component.html',
    styleUrl: './layout.component.less',
    imports: [CommonModule, RouterOutlet, HeaderComponent, SideBarComponent, FooterComponent]
})
export class LayoutComponent {
  title = 'weather-insight-front';

  constructor(public cityService: CityService, private router: Router ) {

  }


  ngOnInit() {
    let urlsData = window.location.href.split("/").filter(e => e);
    if(urlsData.length > 2 && this.cityService.exist(urlsData[2])) {
        this.cityService.selectedCity = urlsData[2];
    } else {
      this.router.navigateByUrl("/");
    }
  }
}
