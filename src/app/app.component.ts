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
      
      let urlsData = window.location.href.split("/").filter((e) => e);
      if (urlsData.length > 2 && this.citiesStore.exist(urlsData[2])) {
        this.citiesStore.selectedCity();
        asapScheduler.schedule(() => patchState(this.citiesStore, {selectedCity: urlsData[2]})); // the fix
      } else {
        this.router.navigateByUrl("/");
      }

    });
  }
  ngOnInit() {

    console.log("isLoading: ", this.citiesStore.isLoading());
    console.log("isLoading: ", this.citiesStore.cities());
  }

  goToCityDashboard(city_code) {
    this.router.navigate(["/", city_code]);
  }
}
