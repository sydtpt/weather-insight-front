import { inject } from "@angular/core";
import {
  patchState,
  signalStoreFeature,
  type,
  withMethods,
} from "@ngrx/signals";
import {
  Observable,
  lastValueFrom,
  map,
  mergeMap,
  of,
} from "rxjs";
import { RawDataStateModel } from "./raw-data.model";
import { ForecastResponse } from "../../shared/models/forecast-response.model";
import { RawDataResponse } from "../../shared/models/http-generic-response.model";
import { ReportsService } from "../../shared/services/reports.service";

export function withRawDataMethods() {
  return signalStoreFeature(
    { state: type<RawDataStateModel>() },
    withMethods((state, reportsService = inject(ReportsService)) => ({
      async getHistoricalDDMM(date: Date, city_code?: string) {
        city_code = city_code ? city_code: state.city().city_code;
        let call = fetchDataPerDDMM(date,city_code, reportsService, state);
        let res = await lastValueFrom(call);
        return res;
      },
      getMax(key: string) {
        return Math.max(state.values[key]);
      },

      getMin(key: string) {
        return Math.min(state.values[key]);
      }

    }))
  );
}


function mergeForecastToRawDay(
  res: RawDataResponse,
  forecastRes: ForecastResponse
) {
  res.apparent_temperature_max.push(
    forecastRes.daily.apparent_temperature_max[0]
  );
  res.apparent_temperature_min.push(
    forecastRes.daily.apparent_temperature_min[0]
  );
  res.temperature_2m_max.push(forecastRes.daily.temperature_2m_max[0]);
  res.temperature_2m_min.push(forecastRes.daily.temperature_2m_min[0]);
  res.date?.push(forecastRes.daily.time[0] * 1000);
  res.date?.push(forecastRes.daily.time[0] * 1000);
  return res;
}

function findMaxKey(arr) {
  if (arr.length === 0) {
    return null;
  }

  let maxNum = -Infinity;
  let maxKey;

  for (let key = 0; key < arr.length; key++) {
    if (arr[key] > maxNum) {
      maxNum = arr[key];
      maxKey = key;
    }
  }

  return maxKey;
}

function fetchDataPerDDMM(
  date: Date,
  city_code: string,
  reportsService: ReportsService,
  state
): Observable<RawDataResponse> {
  city_code = city_code !== "" ? city_code :state.city.city_code();
  let call = reportsService.getRawDataPerDay(date, city_code).pipe(
    mergeMap((res: RawDataResponse) => {
      const dateLimit = new Date();
      dateLimit.setDate(dateLimit.getDate() - 4);
      dateLimit.setHours(0, 0, 0);
      if (date >= dateLimit || res.hasMissingData()) {
        // patchState(state);
        return reportsService
          .getDayForecast(date, state.city.latitude(), state.city.longitude())
          .pipe(
            map((forecastResponse: ForecastResponse) => {
              const today = new Date();
              const isToday =
                today.getFullYear() === date.getFullYear() &&
                today.getMonth() === date.getMonth() &&
                today.getDate() === date.getDate();

              if (!isToday) {
                forecastResponse.current.time = date.getTime() / 1000;
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
              if (res.hasMissingData() && date < today) {
                res = mergeForecastToRawDay(res, forecastResponse);
              }
              patchState(state, { forecast: forecastResponse });
              return res;
            })
          );
      }
      patchState(state, { values: res, forecast: res.getForecastFromDate(date) });
      return of(<RawDataResponse>res);
    })
  );
  return call;
}
