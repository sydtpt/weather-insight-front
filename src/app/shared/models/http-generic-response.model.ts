import { ForecastResponse } from "./forecast-response.model";

export class RawDataResponse {
  apparent_temperature_max: number[];
  apparent_temperature_min: number[];
  apparent_temperature_mean: number[];
  date: number[];
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
  sunrise: number[];
  sunset: number[];
  sunshine_duration?: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  temperature_2m_mean: number[];
  time: number[];
  uv_index_clear_sky_max?: number[];
  uv_index_max?: number[];
  weather_code: number[];
  wind_direction_10m_dominant?: number[];
  wind_gusts_10m_max?: number[];
  wind_speed_10m_max: number[];
  forecast?: ForecastResponse;

  constructor(data?: object) {
    if (!data) {
      return;
    }
    for (let field of Object.keys(data)) {
      this[field] = Object.values(data[field]);
    }
  }

  hasMissingData(): boolean {
    let hasNull = this.weather_code.findIndex((k) => {
      return k === null || k === undefined;
    });
    if (hasNull > -1) {
      return true;
    }
    let lastDate = this.date[this.date.length-1]
    return false;
  }

  contains(date): boolean {
    return !!this.date.find(i => new Date(i*1000).toDateString() === date.toDateString());
  }

  getForecastFromDate(date: Date): ForecastResponse {
    let index = this.date?.findIndex(
      (item) => new Date(item).toDateString() === date.toDateString()
    );
    index = index !== undefined ? index : -1;
    if (index < 0) {
      return new ForecastResponse();
    }
    let temp = {
      current: {
        time: date.getTime() / 1000,
        weather_code: this.weather_code[index],
        temperature_2m:
          (this.temperature_2m_max[index] + this.temperature_2m_min[index]) / 2,
        wind_speed_10m: this.wind_speed_10m_max[index],
        relative_humidity_2m: 0,
        apparent_temperature:
          (this.temperature_2m_max[index] + this.temperature_2m_min[index]) / 2,

        cloud_cover: 0,
        interval: 0,
        is_day: 0,
        precipitation: 0,
        pressure_msl: 0,
        rain: 0,
        showers: 0,
        snowfall: 0,
        surface_pressure: 0,
        wind_direction_10m: 0,
        wind_gusts_10m: 0,
      },
      daily: {
        apparent_temperature_max: this.apparent_temperature_max[index]
          ? [this.apparent_temperature_max[index]]
          : [],
        apparent_temperature_min: [this.apparent_temperature_min[index]],
        apparent_temperature_mean: [this.apparent_temperature_mean[index]],
        date: [this.date[index]],
        // daylight_duration: [this.daylight_duration[index]],
        // et0_fao_evapotranspiration: [this.et0_fao_evapotranspiration[index]],
        // precipitation_hours: [this.precipitation_hours[index]],
        // precipitation_probability_max: [this.precipitation_probability_max[index]],
        // precipitation_sum: [this.precipitation_sum[index]],
        // rain_sum: [this.rain_sum[index]],
        // showers_sum: [this.showers_sum[index]],
        // shortwave_radiation_sum: [this.shortwave_radiation_sum[index]],
        // snowfall_sum: [this.snowfall_sum[index]],
        // solar_radiation_sum: [this.solar_radiation_sum[index]],
        sunrise: [this.sunrise[index]],
        sunset: [this.sunset[index]],
        // sunshine_duration: [this.sunshine_duration[index]],
        temperature_2m_max: [this.temperature_2m_max[index]],
        temperature_2m_min: [this.temperature_2m_min[index]],
        temperature_2m_mean: [this.temperature_2m_mean[index]],
        time: [date.getTime() / 1000],
        // uv_index_clear_sky_max: [this.uv_index_clear_sky_max[index]],
        // uv_index_max: [this.uv_index_max[index]],
        weather_code: [this.weather_code[index]],
        // wind_direction_10m_dominant: [this.wind_direction_10m_dominant[index]],
        // wind_gusts_10m_max: [this.wind_gusts_10m_max[index]],
        wind_speed_10m_max: [this.wind_speed_10m_max[index]],
        hasMissingData: this.hasMissingData,
        getForecastFromDate: this.getForecastFromDate,
        getMinMaxTemp: this.getMinMaxTemp,
        getMax: this.getMax,
        getMin: this.getMin,
        contains: this.contains
      },
    };
    return temp;
  }

  getMax(field: string) {
    let values: number[] = Object.values(this[field]);
    return Math.max(...values);
  }

  getMin(field: string) {
    let values: number[] = Object.values(this[field]);
    return Math.min(...values);
  }

  getMinMaxTemp() {
    let minValues: number[] = Object.values(this.temperature_2m_min);
    let min = Math.min(...minValues);
    let roundMin = Math.round(Math.abs(min)); // Arredonda o número para o inteiro mais próximo
    roundMin *= Math.sign(min);
    let minDay = Object.values(this.temperature_2m_min).findIndex(
      (i) => i === min
    );
    minDay = this.date ? this.date[minDay] : 0;

    let maxValues: number[] = Object.values(this.temperature_2m_max);
    let max = Math.max(...maxValues);
    let roundMax = Math.round(Math.abs(max)); // Arredonda o número para o inteiro mais próximo
    roundMax *= Math.sign(max);
    let maxDay = Object.values(this.temperature_2m_max).findIndex(
      (i) => i === max
    );
    maxDay = this.date ? this.date[maxDay] : 0;
    let avgs: any = Object.values(this.apparent_temperature_mean);

    const LIMIT_AVG_YEARS = 20;
    avgs = avgs.slice(avgs.length - LIMIT_AVG_YEARS, avgs.length + 1);

    let avg = avgs.reduce((sum: any, d) => sum + d, 0) / avgs.length;
    let temp = {
      min: roundMin,
      max: roundMax,
      minDay: new Date(minDay).getFullYear(),
      maxDay: new Date(maxDay).getFullYear(),
      avg: avg,
    };
    return temp;
  }
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