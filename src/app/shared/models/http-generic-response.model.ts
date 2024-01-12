import { ForecastResponse } from "./forecast-response.model";

export interface RawDataResponse {
  apparent_temperature_max: number[];
  apparent_temperature_min: number[];
  apparent_temperature_mean: number[];
  date: Date[];
  daylight_duration?: number[];
  et0_fao_evapotranspiration?: number[];
  precipitation_hours?: number[];
  precipitation_probability_max?: number[];
  precipitation_sum?: number[];
  rain_sum?: number[];
  showers_sum?: number[];
  shortwave_radiation_sum?: number[];
  snowfall_sum?: number[];
  solar_radiation_sum?: number[];
  sunrise: Date[];
  sunset: Date[];
  sunshine_duration?: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  temperature_2m_mean: number[];
  time: Date[];
  uv_index_clear_sky_max?: number[];
  uv_index_max?: number[];
  weather_code: number[];
  wind_direction_10m_dominant?: number[];
  wind_gusts_10m_max?: number[];
  wind_speed_10m_max: number[];
  forecast?: ForecastResponse;
}

export let datasetInit = {
  apparent_temperature_max: [0],
  apparent_temperature_min: [0],
  apparent_temperature_mean: [0],
  date: [new Date()],
  daylight_duration: [0],
  et0_fao_evapotranspiration: [0],
  precipitation_hours: [0],
  precipitation_probability_max: [0],
  precipitation_sum: [0],
  rain_sum: [0],
  showers_sum: [0],
  shortwave_radiation_sum: [0],
  snowfall_sum: [0],
  solar_radiation_sum: [0],
  sunrise: [new Date()],
  sunset: [new Date()],
  sunshine_duration: [0],
  temperature_2m_max: [0],
  temperature_2m_min: [0],
  temperature_2m_mean: [0],
  time: [new Date()],
  uv_index_clear_sky_max: [0],
  uv_index_max: [0],
  weather_code: [0],
  wind_direction_10m_dominant: [0],
  wind_gusts_10m_max: [0],
  wind_speed_10m_max: [0],
}


export class Units {
    time = "unixtime";
    weather_code = "wmo code";
    temperature_2m_max = "°C";
    temperature_2m_min = "°C";
    apparent_temperature_max = "°C";
    apparent_temperature_mi = "°C";
    sunrise = "unixtime";
    sunset = "unixtime";
    daylight_duration = "s";
    sunshine_duration = "s";
    uv_index_max = "";
    uv_index_clear_sky_max = "";
    precipitation_sum = "mm";
    rain_sum = "mm";
    showers_sum = "mm";
    snowfall_sum = "cm";
    precipitation_hours = "h";
    precipitation_probability_max = "%";
    wind_speed_10m_max = "km/h";
    wind_gusts_10m_max = "km/h";
    wind_direction_10m_dominant = "°";
    shortwave_radiation_sum = "MJ/m²";
    et0_fao_evapotranspiration = "mm";
  }