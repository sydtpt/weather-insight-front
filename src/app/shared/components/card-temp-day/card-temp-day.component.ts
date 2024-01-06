import { Component, computed, effect } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterOutlet } from "@angular/router";
import { ReportsService } from "../../services/reports.service";
import { WEATHER_CODES as weatherCodes } from "../../models/weather_codes.model"

@Component({
  selector: "app-card-temp-day",
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: "./card-temp-day.component.html",
  styleUrl: "./card-temp-day.component.less",
})
export class CardTempDayComponent {

  data$: any = undefined;
  constructor(private reportsService: ReportsService) {
    effect(() => {
      let data = this.reportsService.dayForecastSignal();
      let test = !!Object.keys(data).length;
      if (test) {
        this.data$ = data;
      }
    });
 }

  ngOnInit(): void {
  }

  getTemp() {
    if (!this.data$) {
      return
    }

    // is from today*
    if (Array.isArray(this.data$["daily"].time)) {
      let time = new Date(this.data$["daily"].time[0] * 1000);
      let today = new Date().toDateString();
      if (time.toDateString() === today) {
        return this.data$["current"].apparent_temperature.toFixed();
      }
    }
    // isfrom other day, do math
    let max = this.data$["daily"].temperature_2m_max;
    let min = this.data$["daily"].temperature_2m_min;
    max = Array.isArray(max) ? max[0] : max;
    min = Array.isArray(min) ? min[0] : min;
    return ((max + min) / 2).toFixed();
  }

  getFeelsLike() {
    if (!this.data$) {
      return
    }
    if (Array.isArray(this.data$["daily"].time)) {
      let time = new Date(this.data$["daily"].time[0] * 1000);
      let today = new Date().toDateString();
      if (time.toDateString() === today) {
        return this.data$["current"].apparent_temperature.toFixed();
      }
    }
    if (this.data$["daily"].apparent_temperature) {
      return this.data$["daily"].apparent_temperature.toFixed();
    }
    let max = this.data$["daily"].apparent_temperature_max;
    let min = this.data$["daily"].apparent_temperature_min;
    max = Array.isArray(max) ? max[0] : max;
    min = Array.isArray(min) ? min[0] : min;
    return ((max + min) / 2).toFixed();
  }

  getEmojyByCodeWeatherCode(weather_code?) {
      if (Array.isArray(this.data$["daily"].time)) {
        let time = new Date(this.data$["daily"].time[0] * 1000);
        let today = new Date().toDateString();
        if (time.toDateString() !== today) {
          return weatherCodes[this.data$["daily"].weather_code];
        }
      }
      return weatherCodes[weather_code];
  }


  getWind() {
    // is from today*
    if (Array.isArray(this.data$["daily"].time)) {
      let time = new Date(this.data$["daily"].time[0] * 1000);
      let today = new Date().toDateString();
      if (time.toDateString() === today) {
        return this.data$["current"].apparent_temperature.toFixed();
      }
    }
    return;
  }

  getMaxTemp(){
    let max = this.data$["daily"].temperature_2m_max;
    if(!max) {
      return "N/D"
    }
    return Array.isArray(max) ? max[0].toFixed() : max.toFixed();
  }

  getMinTemp(){
    let min = this.data$["daily"].temperature_2m_min;
    if(!min) {
      return "N/D"
    }
    return Array.isArray(min) ? min[0].toFixed() : min.toFixed();
  }
}
