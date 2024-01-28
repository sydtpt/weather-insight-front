import {
  ChangeDetectionStrategy,
  Component,
  Input,
  inject,
  signal,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterOutlet } from "@angular/router";
import { WEATHER_CODES as weatherCodes } from "../../models/weather-codes.model";
import {
  ForecastResponse,
  forecastInit,
} from "../../models/forecast-response.model";
import { Moon } from "lunarphase-js";
import { CitiesStore } from "../../../store/cities.store";
import { LocalTimePipe } from "../../pipes/time.pipe";
import { isToday } from "../../utils/utils";

@Component({
  selector: "app-card-temp-day",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterOutlet, LocalTimePipe],
  templateUrl: "./card-temp-day.component.html",
  styleUrl: "./card-temp-day.component.less",
})
export class CardTempDayComponent {
  citiesStore = inject(CitiesStore);
  forecast = signal<ForecastResponse>(forecastInit);

  @Input({ required: true, alias: "forecast" }) set _forecast(
    forecast: ForecastResponse
  ) {
    this.forecast.set(forecast);
    this.isLoading.set(false);
  }
  isLoading = signal(true);

  ngOnInit(): void {}

  getTemp() {
    return this.forecast().current.temperature_2m.toFixed();
  }

  getFeelsLike() {
    return this.forecast().current.apparent_temperature.toFixed();
  }

  getEmojyByCodeWeatherCode(weather_code?: number) {
    return weatherCodes[this.forecast().current.weather_code];
  }

  getWind() {
    return this.forecast().current.wind_speed_10m.toFixed();
  }

  getMaxTemp() {
    return this.forecast().daily.temperature_2m_max[0].toFixed();
  }

  getMaxFeelsLike() {
    return this.forecast().daily.apparent_temperature_max[0].toFixed();
  }

  getMinTemp() {
    return this.forecast().daily.temperature_2m_min[0].toFixed();
  }

  getMinFeelsLike() {
    return this.forecast().daily.apparent_temperature_min[0].toFixed();
  }

  getTodayDescription() {
    const date = this.forecast().current.time;
    if (new Date().toDateString() === date.toDateString()) {
      return "Today";
    }

    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "long" });

    const formattedDate = `${day}, ${month}`;
    return formattedDate;
  }

  get sunset() {
    return this.forecast().daily.sunset[0];
  }

  get sunrise() {
      return this.forecast().daily.sunrise[0];
  }

  get humidity() {
    return this.forecast().current.relative_humidity_2m;
  }
  

  getMoonPhaseDescription() {
    return Moon.lunarPhase(this.forecast().current.time);
  }

  getMoonPhaseEmoji() {
    return Moon.lunarPhaseEmoji(this.forecast().current.time);
  }

  /*
        Code	Description
        0	Clear sky
        1, 2, 3	Mainly clear, partly cloudy, and overcast
        45, 48	Fog and depositing rime fog
        51, 53, 55	Drizzle: Light, moderate, and dense intensity
        56, 57	Freezing Drizzle: Light and dense intensity
        61, 63, 65	Rain: Slight, moderate and heavy intensity
        66, 67	Freezing Rain: Light and heavy intensity
        71, 73, 75	Snow fall: Slight, moderate, and heavy intensity
        77	Snow grains
        80, 81, 82	Rain showers: Slight, moderate, and violent
        85, 86	Snow showers slight and heavy
        95 *	Thunderstorm: Slight or moderate
        96, 99 *	Thunderstorm with slight and heavy hail
  */
  getImage() {
    let path = "assets/img/weather/";
    let weather_code;
    if (isToday(this.forecast().current.time)) {
      weather_code = this.forecast().current.weather_code;
    } else {
      weather_code = this.forecast().daily["weather_code"][0];
    }
    switch (weather_code) {

      // clear
      case 0:
        return  path + "clear.svg";

      // mainly clear
      case 1:
        return path + "mainly-clear.svg";

      // partly cloudy
      case 2:
        return path + "partly-cloud.svg";

      // partly cloudy
      case 3:
        return path + "cloudy.svg";

      // 45 Fog
      case 45:
        return path + "fog.svg";

      // depositing rime fog
      case 48:
        return path + "haze.svg";

      // 51, 53, 55	Drizzle: Light,, and
      case 51:
        return path + "drizzle-1.svg";

      // drizzle dense
      case 53:
        return path + "drizzle-1.svg";

      // drizzle intensity
      case 53:
        return path + "rain3.svg";

      // Freezing Drizzle: Light
      case 56:
        return path + "cold-rain.svg";

      // Freezing Drizzle: dense intensity
      case 57:
        return path + "snow-and-sleet.svg";

      // Rain: Slight, moderate and heavy intensity
      case 61:
        return path + "rainy1.svg";

      // Rain: moderate
      case 63:
        return path + "rainy2.svg";

      // Rain: heavy intensity
      case 65:
        return path + "rain3.svg";

      // 66, 67	Freezing Rain: Light and heavy intensity
      case 66 || 67:
        return path + "snow-and-sleet.svg";

      // Snow fall: Slight
      case 71:
        return path + "snowy-1.svg";

      // Snow fall: moderate
      case 73:
        return path + "snowy-2.svg";

      // Snow fall: heavy intensity
      case 75:
        return path + "snowy-3.svg";

      // Snow fall: grains
      case 77:
        return path + "snowy-3.svg";

      // , , 	Rain showers: Slight, moderate, and violent

      case 80:
        return path + "rain3.svg";

      case 81:
        return path + "rain3.svg";

      case 82:
        return path + "rain3.svg";

      // 85, 86	Snow showers slight and heavy
      case 85:
        return path + "snowy-3.svg";

      case 86:
        return path + "snowy-3.svg";

      case 95 || 96 || 99:
        return path + "thunder.svg";

      default:
        return "partly-cloud.svg";
    }
  }

}
