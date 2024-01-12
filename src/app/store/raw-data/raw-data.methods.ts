import { inject } from "@angular/core";
import {
  patchState,
  signalStoreFeature,
  type,
  withMethods,
} from "@ngrx/signals";
import { Observable, lastValueFrom, map, mergeMap, of } from "rxjs";
import { RawDataStateModel } from "./raw-data.model";
import { ForecastResponse, forecastInit } from "../../shared/models/forecast-response.model";
import { RawDataResponse } from "../../shared/models/http-generic-response.model";
import { ReportsService } from "../../shared/services/reports.service";

export function withRawDataMethods() {
  return signalStoreFeature(
    { state: type<RawDataStateModel>() },
    withMethods((state, reportsService = inject(ReportsService)) => ({
      async getHistoricalDDMM(date: Date, city_code?: string) {
       
        city_code = city_code ? city_code : state.city().city_code;
        let call = fetchDataPerDDMM(date, city_code, reportsService, state);
        let res = await lastValueFrom(call);
        patchState(state, { isLoading: false, values: res });
        return res;
      },

      contains(date: Date): boolean {
        return !!state
          .values()
          .date.find((i) => i.toDateString() === date.toDateString());
      },

      getMax(field: string) {
        let values: number[] = Object.values(this[field]);
        return Math.max(...values);
      },

      getMin(field: string) {
        let values: number[] = Object.values(this[field]);
        return Math.min(...values);
      },
    }))
  );
}

function mergeForecastToRawDay(
  res: RawDataResponse,
  forecastRes: ForecastResponse,
  date: Date
) {
  if (hasMissingData(res)) {
    let missingIndex = res.apparent_temperature_max.findIndex((item) => !item);
    res.apparent_temperature_max[missingIndex] =
      forecastRes.daily.apparent_temperature_max[0];
    res.apparent_temperature_min[missingIndex] =
      forecastRes.daily.apparent_temperature_min[0];
    res.temperature_2m_max[missingIndex] =
      forecastRes.daily.temperature_2m_max[0];
    res.temperature_2m_min[missingIndex] =
      forecastRes.daily.temperature_2m_min[0];
    res.date[missingIndex] = new Date(forecastRes.daily.time[0]);
  } else {
    res.apparent_temperature_max.push(
      forecastRes.daily.apparent_temperature_max[0]
    );
    res.apparent_temperature_min.push(
      forecastRes.daily.apparent_temperature_min[0]
    );
    res.temperature_2m_max.push(forecastRes.daily.temperature_2m_max[0]);
    res.temperature_2m_min.push(forecastRes.daily.temperature_2m_min[0]);
    res.date?.push(new Date(forecastRes.daily.time[0]));
  }
  return res;
}

function fetchDataPerDDMM(
  date: Date,
  city_code: string,
  reportsService: ReportsService,
  state
): Observable<RawDataResponse> {
  
  city_code = city_code !== "" ? city_code : state.city.city_code();
  let call = reportsService.getRawDataPerDay(date, city_code).pipe(
    mergeMap((res: RawDataResponse) => {
      const dateLimit = new Date();
      dateLimit.setDate(dateLimit.getDate() - 4);
      dateLimit.setHours(0, 0, 0);
      if (date >= dateLimit || hasMissingData(res)) {
        return reportsService
          .getDayForecast(date, state.city.latitude(), state.city.longitude())
          .pipe(
            map((forecastResponse: ForecastResponse) => {
              let date = forecastResponse.daily?.sunset[0];
              const today = new Date();
              const isToday =
                today.getFullYear() === date.getFullYear() &&
                today.getMonth() === date.getMonth() &&
                today.getDate() === date.getDate();

              if (!isToday) {
                forecastResponse.current.time = new Date(date);
                let mean = forecastResponse.daily.temperature_2m_mean
                  ? forecastResponse.daily.temperature_2m_mean[0]
                  : (forecastResponse.daily.temperature_2m_max[0] +
                      forecastResponse.daily.temperature_2m_min[0]) /
                    2;
                forecastResponse.current.temperature_2m = mean;

                let feelsLike = forecastResponse.daily.apparent_temperature_mean
                  ? forecastResponse.daily.apparent_temperature_mean[0]
                  : (forecastResponse.daily.apparent_temperature_max[0] +
                      forecastResponse.daily.apparent_temperature_min[0]) /
                    2;
                forecastResponse.current.apparent_temperature = feelsLike;
              }
              if (
                hasMissingData(res) ||
                !res.date.find((i) => i.toDateString() === date.toDateString())
              ) {
                res = mergeForecastToRawDay(res, forecastResponse, date);
              }
              patchState(state, { forecast: forecastResponse });
              return res;
            })
          );
      }
      patchState(state, { forecast: convertDateToForecast(date, res) });
      return of(res);
    })
  );
  return call;
}

function hasMissingData(res: RawDataResponse): boolean {
  let hasNull = res.weather_code.findIndex((k) => {
    return k === null || k === undefined;
  });
  if (hasNull > -1) {
    return true;
  }
  return false;
}

function convertDateToForecast(
  date: Date,
  res: RawDataResponse
): ForecastResponse {
  let index = res.date.findIndex(
    (item) => item.toDateString() === date.toDateString()
  );
  index = index !== undefined ? index : -1;
  if (index < 0) {
    return forecastInit;
  }

  let temp = {
    current: {
      time: date,
      weather_code: res.weather_code[index],
      temperature_2m:
        (res.temperature_2m_max[index] + res.temperature_2m_min[index]) / 2,
      wind_speed_10m: res.wind_speed_10m_max[index],
      relative_humidity_2m: 0,
      apparent_temperature:
        (res.temperature_2m_max[index] + res.temperature_2m_min[index]) / 2,

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
      apparent_temperature_max: res.apparent_temperature_max[index]
        ? [res.apparent_temperature_max[index]]
        : [],
      apparent_temperature_min: [res.apparent_temperature_min[index]],
      apparent_temperature_mean: [res.apparent_temperature_mean[index]],
      date: [res.date[index]],
      // daylight_duration: [res.daylight_duration[index]],
      // et0_fao_evapotranspiration: [res.et0_fao_evapotranspiration[index]],
      // precipitation_hours: [res.precipitation_hours[index]],
      // precipitation_probability_max: [res.precipitation_probability_max[index]],
      // precipitation_sum: [res.precipitation_sum[index]],
      // rain_sum: [res.rain_sum[index]],
      // showers_sum: [res.showers_sum[index]],
      // shortwave_radiation_sum: [res.shortwave_radiation_sum[index]],
      // snowfall_sum: [res.snowfall_sum[index]],
      // solar_radiation_sum: [res.solar_radiation_sum[index]],
      sunrise: [res.sunrise[index]],
      sunset: [res.sunset[index]],
      // sunshine_duration: [res.sunshine_duration[index]],
      temperature_2m_max: [res.temperature_2m_max[index]],
      temperature_2m_min: [res.temperature_2m_min[index]],
      temperature_2m_mean: [res.temperature_2m_mean[index]],
      time: [res.date[index]],
      // uv_index_clear_sky_max: [res.uv_index_clear_sky_max[index]],
      // uv_index_max: [res.uv_index_max[index]],
      weather_code: [res.weather_code[index]],
      // wind_direction_10m_dominant: [res.wind_direction_10m_dominant[index]],
      // wind_gusts_10m_max: [res.wind_gusts_10m_max[index]],
      wind_speed_10m_max: [res.wind_speed_10m_max[index]],
    },
  };
  return temp;
}
