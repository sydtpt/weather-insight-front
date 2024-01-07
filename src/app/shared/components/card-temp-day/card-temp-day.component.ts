import { Component, computed, effect } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterOutlet } from "@angular/router";
import { ReportsService } from "../../services/today.service";
import { WEATHER_CODES as weatherCodes } from "../../models/weather-codes.model"
import { ForecastResponse } from "../../models/forecast-response.model";
import { Moon } from "lunarphase-js";
import { CityService } from "../../services/city.service";

@Component({
  selector: "app-card-temp-day",
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: "./card-temp-day.component.html",
  styleUrl: "./card-temp-day.component.less",
})
export class CardTempDayComponent {


  data: ForecastResponse;
  constructor(private reportsService: ReportsService, private cityService: CityService) {
    effect(() => {
      let data = this.reportsService.dayForecastSignal();
      let test = !!Object.keys(data).length;
      if (test) {
        this.data = data;
      }
    });
 }

  ngOnInit(): void {
  }

  getTemp() {
    return this.data.current.temperature_2m.toFixed();
  }

  getFeelsLike() {
    return this.data.current.apparent_temperature.toFixed();
  }

  getEmojyByCodeWeatherCode(weather_code?) {
    return weatherCodes[weather_code];
  }


  getWind() {
    return this.data.current.wind_speed_10m.toFixed();
  }

  getMaxTemp(){
    return this.data.daily.temperature_2m_max[0].toFixed();
  }

  getMinTemp(){
    return this.data.daily.temperature_2m_min[0].toFixed();
  }

  getTodayDescription() {
    const date = new Date(this.data.current.time * 1000)
    if (new Date().toDateString() === date.toDateString()) {
      return "Today";
    }

    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });

    const formattedDate = `${day}, ${month}`;
    return formattedDate;
  }

  get sunset(){
    if(this.data.daily) {
      let sunset = new Date(this.data.daily.sunset[0]*1000);
      console.log(this.cityService.getTimeZone())
      return sunset.toLocaleString("pt-BR",{ timeZone: this.cityService.getTimeZone() }).split(", ")[1].substring(0,5)
    } else {
      return "";
    }
  }

  get sunrise(){
    if(this.data.daily) {
      let sunrise = new Date(this.data.daily.sunrise[0]*1000);
      debugger
      return sunrise.toLocaleString("pt-BR",{ timeZone: this.cityService.getTimeZone() }).split(", ")[1].substring(0,5)
    } else {
      return "";
    }
  }

  get humidity(){
    if(this.data.current.relative_humidity_2m) {
      return this.data.current.relative_humidity_2m;
    } else {
      return false;
    }
  }


  getMoonPhaseDescription() {
    return Moon.lunarPhase(new Date(this.data.current.time *1000));
  }

  getMoonPhaseEmoji() {
    return Moon.lunarPhaseEmoji(new Date(this.data.current.time *1000));
  }

}
