import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CityService } from '../../../shared/services/city.service';

@Component({
  selector: 'app-side-bar',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.less'
})
export class SideBarComponent {
  title = 'weather-insight-front';


  constructor(public cityService: CityService, private router: Router ) {}

  ngOnInit() {
  }

}
