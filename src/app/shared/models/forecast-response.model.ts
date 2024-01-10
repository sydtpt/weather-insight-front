import { RawDataResponse, Units, } from "./http-generic-response.model";

class CurrentUnits {
  time = "unixtime";
  interval = "seconds";
  temperature_2m = "°C";
  relative_humidity_2m = "";
  apparent_temperature = "°C";
  precipitation = "mm";
  rain = "mm";
  showers = "mm";
  snowfall = "cm";
  weather_code = "wmo code";
  cloud_cover = "%";
  pressure_msl = "hPa";
  surface_pressure = "hPa";
  wind_speed_10m = "km/h";
  wind_direction_10m = "°";
  wind_gusts_10m = "km/h";
}


export class ForecastResponse {
  current: ICurrent;
  currentUnits?: CurrentUnits;
  daily: IDaily;
  dailyUnits?: Units;
}

interface ICurrent {
  apparent_temperature: number;
  cloud_cover: number;
  interval: number;
  is_day: number;
  precipitation: number;
  pressure_msl: number;
  rain: number;
  relative_humidity_2m: number;
  showers: number;
  snowfall: number;
  surface_pressure: number;
  temperature_2m: number;
  time: Date;
  weather_code: number;
  wind_direction_10m: number;
  wind_gusts_10m: number;
  wind_speed_10m: number;
}


interface IDaily {
  apparent_temperature_max: number[];
  apparent_temperature_min: number[];
  sunrise: Date[];
  sunset: Date[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  time: Date[];
  temperature_2m_mean: number[];
  apparent_temperature_mean: number[]
}