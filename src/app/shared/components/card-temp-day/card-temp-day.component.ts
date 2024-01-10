import { ChangeDetectionStrategy, Component, Input, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterOutlet } from "@angular/router";
import { WEATHER_CODES as weatherCodes } from "../../models/weather-codes.model"
import { ForecastResponse } from "../../models/forecast-response.model";
import { Moon } from "lunarphase-js";
import { CitiesStore } from "../../../store/cities.store";

@Component({
  selector: "app-card-temp-day",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterOutlet],
  templateUrl: "./card-temp-day.component.html",
  styleUrl: "./card-temp-day.component.less",
})
export class CardTempDayComponent {
  citiesStore = inject(CitiesStore);
  @Input() dataset: ForecastResponse | undefined;

  constructor() {
  }

  ngOnInit(): void {

  }

  getTemp() {
    return this.dataset?.current.temperature_2m.toFixed();
  }

  getFeelsLike() {
    return this.dataset?.current.apparent_temperature.toFixed();
  }

  getEmojyByCodeWeatherCode(weather_code?) {
    let forecaset = this.dataset;
    if (!forecaset) {
        return "";
    }
    return weatherCodes[forecaset.current.weather_code];
  }


  getWind() {
    return this.dataset?.current.wind_speed_10m.toFixed();
  }

  getMaxTemp(){
    return this.dataset?.daily.temperature_2m_max[0].toFixed();
  }

  getMinTemp(){
    return this.dataset?.daily.temperature_2m_min[0].toFixed();
  }

  getTodayDescription() {
    let forecaset = this.dataset;
    if (!forecaset) {
        return "";
    }
    const date = new Date(forecaset.current.time * 1000)
    if (new Date().toDateString() === date.toDateString()) {
      return "Today";
    }

    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });

    const formattedDate = `${day}, ${month}`;
    return formattedDate;
  }

  get sunset(){
    let forecaset = this.dataset;
    if (!forecaset) {
        return "";
    }
    if(this.dataset?.daily) {
      let sunset = new Date(this.dataset?.daily.sunset[0]*1000);
      return sunset.toLocaleString("pt-BR",{ timeZone: this.citiesStore.getTimeZone() }).split(", ")[1].substring(0,5);
    } else {
      return "";
    }
  }

  get sunrise(){
    if(this.dataset?.daily) {
      let sunrise = new Date(this.dataset?.daily.sunrise[0]*1000);
      return sunrise.toLocaleString("pt-BR",{ timeZone: this.citiesStore.getTimeZone() }).split(", ")[1].substring(0,5)
    } else {
      return "";
    }
  }

  get humidity(){
    if(this.dataset?.current.relative_humidity_2m) {
      return this.dataset?.current.relative_humidity_2m;
    } else {
      return false;
    }
  }


  getMoonPhaseDescription() {
    let forecaset = this.dataset;
    if (!forecaset) {
        return "";
    }
    return Moon.lunarPhase(new Date(forecaset.current.time *1000));
  }

  getMoonPhaseEmoji() {
    let forecaset = this.dataset;
    if (!forecaset) {
        return "";
    }
    return Moon.lunarPhaseEmoji(new Date(forecaset.current.time *1000));
  }

}
