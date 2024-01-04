import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterOutlet } from "@angular/router";
import { Moon } from "lunarphase-js";
import { ReportsService } from "../../services/reports.service";
import { WEATHER_CODES as weatherCodes } from "../../models/weather_codes.model"
import { tap } from "rxjs/operators";

@Component({
  selector: "app-card-temp-day",
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: "./card-temp-day.component.html",
  styleUrl: "./card-temp-day.component.less",
})
export class CardTempDayComponent {
  public data$ = this.reportsService.getDayForecast()
    .pipe(tap((data) => {this.calcDiffFromAvg(data)}));
  
  constructor(private reportsService: ReportsService) {}
  
  diffTemp;
  diffTempIcon;

  ngOnInit(): void {
    //this.data$.subscribe();
  }

  getEmojyByCodeWeatherCode(weather_code) {
      return weatherCodes[weather_code];
  }
  
  calcDiffFromAvg(data) {


    this.reportsService.getMinAndMaxPerDay()
      .subscribe(avg => {
      })

}



}
