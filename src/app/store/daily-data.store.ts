import { computed, inject } from "@angular/core";
import {
  signalStore,
  patchState,
  withComputed,
  withMethods,
  withState,
  withHooks,
} from "@ngrx/signals";
import { withEntities } from "@ngrx/signals/entities";
import {
  DailyHistoryResponse,
  ForecastResponse,
} from "../shared/models/forecast-response.model";
import { ReportsService } from "../shared/services/reports.service";
import { City } from "../shared/models/city.model";
import { Observable, lastValueFrom, map, mergeMap, of } from "rxjs";

type State = {
  date: Date;
  values: DailyHistoryResponse;
  isLoading: boolean;
  city: City;
  forecast: ForecastResponse;
};
const initialState: State = {
  date: new Date(),
  forecast: new ForecastResponse(),
  values: new DailyHistoryResponse(),
  isLoading: true,
  city: {
    city_code: "",
    city_desc: "",
    latitude: "",
    longitude: "",
    image: "",
    timezone: "",
  },
};

export const DailyStore = signalStore(
  { providedIn: "root" },
  withEntities<DailyHistoryResponse>(),
  withState(initialState),
  withComputed((store) => ({
     maxTemp: computed(() => {
        if (Object.keys(store.values()).length) {
          let key = findMaxKey(store.values().temperature_2m_max);
             let max = store.values().temperature_2m_max[key];
             let date = store.values().date[key];
             return {max: max, date: new Date(date)}
        }
        return {max: 0, date: new Date()}
    }
     ),
    // TO DO
  })),

  withMethods((store, cityService = inject(ReportsService)) => {
    return {
      async getHistoricalDDMM(date: Date, city?: City) {
        if (!city) {
          city = store.city();
        }
        let call = cityService.getDataPerDay(date, city).pipe(
          mergeMap((res) => {
            let day = date.getDate();
            let month = date.getMonth() + 1;
            this.currentDD = day;
            this.currentMM = month;
            // check if data of last day is missing
            // if day is near get from getDayForecast instead of history
            const dateLimit = new Date();
            dateLimit.setHours(0, 0, 0);
            dateLimit.setDate(dateLimit.getDate() - 4);
            if (date >= dateLimit) {
              patchState(store, { values: res });
              return cityService.getDayForecast(date, store.city.latitude(), store.city.longitude()).pipe(
                map((res) => {
                  const today = new Date();
                  const isToday =
                    today.getFullYear() === date.getFullYear() &&
                    today.getMonth() === date.getMonth() &&
                    today.getDate() === date.getDate();

                  if (!isToday) {
                    res.current.time = date.getTime() / 1000;
                    let mean = res.daily.temperature_2m_mean
                      ? res.daily.temperature_2m_mean[0]
                      : (res.daily.temperature_2m_max[0] +
                          res.daily.temperature_2m_min[0]) /
                        2;
                    res.current.temperature_2m = mean;

                    let feelsLike = res.daily.apparent_temperature_mean
                      ? res.daily.apparent_temperature_mean[0]
                      : (res.daily.apparent_temperature_max[0] +
                          res.daily.apparent_temperature_min[0]) /
                        2;
                    res.current.apparent_temperature = feelsLike;
                  }
                  return res;
                }),
                map((forecastRes: ForecastResponse) => {
                  let today = new Date();
                  if (res.hasMissingData() && date < today) {
                    res = mergeForecastToRawDay(res, forecastRes);
                  }
                  patchState(store, { forecast: forecastRes });
                  res["forecast"] = forecastRes;
                  return res;
                })
              );
            }
            patchState(store, { forecast: res.getForecastFromDate(date) });
            patchState(store, { values: res });
            return of(res);
          })
        );
        let res = await lastValueFrom(call);
        return res;
      },
      async getDayForecast(date: Date) {
        return this.getRawDataPerDay(date);
      },

    };
  }),

  withHooks({
    onInit() {
      console.log("++++++++++++++++++++++++++++++++");
      console.log("onInit: DailyStore");
      console.log("++++++++++++++++++++++++++++++++");
    },
    onDestroy() {
      console.log("++++++++++++++++++++++++++++++++");
      console.log("onDestroy: DailyStore");
      console.log("++++++++++++++++++++++++++++++++");
    },
  })
);

function mergeForecastWithDailyHistory() {
  /*const today = new Date();
  const isToday =
    today.getFullYear() === selectedDate.getFullYear() &&
    today.getMonth() === selectedDate.getMonth() &&
    today.getDate() === selectedDate.getDate();

  if (!isToday) {
    res.current.time = selectedDate.getTime() / 1000;
    let mean = res.daily.temperature_2m_mean
      ? res.daily.temperature_2m_mean[0]
      : (res.daily.temperature_2m_max[0] + res.daily.temperature_2m_min[0]) / 2;
    res.current.temperature_2m = mean;

    let feelsLike = res.daily.apparent_temperature_mean
      ? res.daily.apparent_temperature_mean[0]
      : (res.daily.apparent_temperature_max[0] +
          res.daily.apparent_temperature_min[0]) /
        2;
    res.current.apparent_temperature = feelsLike;
  }
  this.dayForecastSignal.set(res);
  return res;*/
}

function mergeForecastToRawDay(
  res: DailyHistoryResponse,
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