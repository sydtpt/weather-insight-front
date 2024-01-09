import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CitiesStore } from '../../../store/cities.store';

@Component({
  selector: 'app-side-bar',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.less'
})
export class SideBarComponent {
  citiesStore = inject(CitiesStore);
  

  constructor( ) {}

  ngOnInit() {
  }

}
