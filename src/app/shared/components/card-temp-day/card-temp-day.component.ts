import { ChangeDetectionStrategy, Component, Input, inject, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterOutlet } from "@angular/router";
import { WEATHER_CODES as weatherCodes } from "../../models/weather-codes.model"
import { ForecastResponse, forecastInit } from "../../models/forecast-response.model";
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
  forecast =  signal<ForecastResponse>(forecastInit);

  @Input({required: true, alias: "forecast"}) set _forecast(forecast: ForecastResponse) {
    this.forecast.set(forecast);
    this.isLoading.set(false);
  }
  isLoading = signal(true);

  ngOnInit(): void {

  }

  getTemp() {
    return this.forecast().current.temperature_2m.toFixed();
  }

  getFeelsLike() {
    return this.forecast().current.apparent_temperature.toFixed();
  }

  getEmojyByCodeWeatherCode(weather_code?) {
    let forecaset = this.forecast();
    if (!forecaset) {
        return "";
    }
    return weatherCodes[forecaset.current.weather_code];
  }


  getWind() {
    return this.forecast().current.wind_speed_10m.toFixed();
  }

  getMaxTemp(){
    return this.forecast().daily.temperature_2m_max[0].toFixed();
  }

  getMaxFeelsLike(){
    return this.forecast().daily.apparent_temperature_max[0].toFixed();
  }

  getMinTemp(){
    return this.forecast().daily.temperature_2m_min[0].toFixed();
  }


  getMinFeelsLike(){
    return this.forecast().daily.apparent_temperature_min[0].toFixed();
  }

  getTodayDescription() {
    let forecaset = this.forecast();
    if (!forecaset) {
        return "";
    }
    const date = forecaset.current.time;
    if (new Date().toDateString() === date.toDateString()) {
      return "Today";
    }

    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });

    const formattedDate = `${day}, ${month}`;
    return formattedDate;
  }

  get sunset(){
    let forecaset = this.forecast();
    if (!forecaset) {
        return "";
    }
    if(this.forecast().daily) {
      let sunset = this.forecast().daily.sunset[0];
      return sunset.toLocaleString("pt-BR",{ timeZone: this.citiesStore.getTimeZone() }).split(", ")[1].substring(0,5);
    } else {
      return "";
    }
  }

  get sunrise(){
    if(this.forecast().daily) {
      let sunrise = this.forecast().daily.sunrise[0];
      return sunrise.toLocaleString("pt-BR",{ timeZone: this.citiesStore.getTimeZone() }).split(", ")[1].substring(0,5)
    } else {
      return "";
    }
  }

  get humidity(){
    if(this.forecast().current.relative_humidity_2m) {
      return this.forecast().current.relative_humidity_2m;
    } else {
      return false;
    }
  }


  getMoonPhaseDescription() {
    let forecaset = this.forecast();
    if (!forecaset) {
        return "";
    }
    return Moon.lunarPhase(forecaset.current.time);
  }

  getMoonPhaseEmoji() {
    let forecaset = this.forecast();
    if (!forecaset) {
        return "";
    }
    return Moon.lunarPhaseEmoji(forecaset.current.time);
  }

}
