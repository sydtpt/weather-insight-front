import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from "../header/header.component";
import { SideBarComponent } from "../side-bar/header/sidebar.component";
import { FooterComponent } from "../footer/footer.component";
import { CitiesStore } from '../../store/cities.store';
import { RawDataStore } from '../../store/raw-data/raw-data.store';
import { LoaderComponent } from '../../shared/components/loader/loader.component';
import { patchState } from '@ngrx/signals';

@Component({
    selector: 'app-layout',
    standalone: true,
    templateUrl: './layout.component.html',
    styleUrl: './layout.component.less',
    imports: [CommonModule, RouterOutlet, HeaderComponent, SideBarComponent, FooterComponent, LoaderComponent]
})
export class LayoutComponent {
  citiesStore = inject(CitiesStore);
  rawDataStore = inject(RawDataStore);

  @Input() city: string;
  constructor(private router: Router ) {
    patchState(this.rawDataStore, {isLoading: true})
  }

  ngOnInit() {

    this.router.routeReuseStrategy.shouldReuseRoute = () => {
      return false;
    };
  }
}
