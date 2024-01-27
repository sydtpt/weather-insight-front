import { Component, effect, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from "@angular/router";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule } from "@angular/forms";
import { CitiesStore } from "./store/cities.store";
import { patchState } from "@ngrx/signals";
import { asapScheduler } from 'rxjs';

@Component({
  selector: "app-root",
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.less",
})
export class AppComponent {
  citiesStore = inject(CitiesStore);

  constructor(private router: Router) {
    effect(() => {
      if(this.citiesStore.isLoading()) {
        return;
      }
      let urlsData = window.location.href.split("/").filter(Boolean);
      let cityFromUrl = urlsData[2];

      if (cityFromUrl) {
        let city = this.citiesStore.selectCity(cityFromUrl);
        if (city) {
          asapScheduler.schedule(() => {
            try {
              patchState(this.citiesStore, {selectedCity: city});
              this.router.navigate([cityFromUrl]);
            } catch (error) {
              console.error('Navigation error', error);
            }
          });
        } else {
          // this.router.navigateByUrl("/");
        }
      }

    });
  }
  ngOnInit() {
    this.citiesStore.load();
  }

  goToCityDashboard(city_code) {
    this.router.navigate(["/", city_code]);
  }
}
