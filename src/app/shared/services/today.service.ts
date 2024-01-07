import { Injectable, Signal, effect, signal } from "@angular/core";
import { HttpService } from "./http.service";
import { map, mergeMap, tap } from "rxjs/operators";
import { of } from "rxjs";
import { CityService } from "./city.service";
import { DailyHistoryResponse, ForecastResponse } from "../models/forecast-response.model";
import { Observable } from "../../../assets/vendor/tinymce/tinymce";

@Injectable({ providedIn: "root" })
export class ReportsService {
  public getMinAndMaxPerDaySignal: any = signal({});
  public rawDataPerDaySignal = signal<DailyHistoryResponse>(new DailyHistoryResponse());
  public dayForecastSignal = signal<ForecastResponse>(new ForecastResponse());

  private rawDataFromDay: DailyHistoryResponse;

  private currentDD;
  private currentMM;

  /*   Move to external file   */
  private forecastApi = `https://api.open-meteo.com/v1/forecast?
latitude={{lat}}&longitude={{long}}
&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m
&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset
&format=json
&start_date={{start_date}}
&end_date={{end_date}}
&timeformat=unixtime`;

  constructor(private http: HttpService, private cityService: CityService) {
    effect(
      () => {
        if (Object.keys(this.rawDataPerDaySignal()).length) {
          this.getMinAndMaxPerDaySignal.set(this.rawDataFromDay.getMinMaxTemp());
        }
      },
      { allowSignalWrites: true }
    );
  }

  getHistoricalDDMM(date: Date) {
    return this.getRawDataPerDay(date);
  }

  getDayForecast(selectedDate: Date) {
    let coords = this.cityService.getCityLatLon();
    let api = this.forecastApi
      .replace("{{lat}}", coords.latitude)
      .replace("{{long}}", coords.longiture)
      .replace("{{start_date}}", selectedDate.toISOString().split("T")[0])
      .replace("{{end_date}}", selectedDate.toISOString().split("T")[0]);
    return this.http.getForecast(api).pipe(
      map((res) => {
        const today = new Date();

        const isToday = today.getFullYear() === selectedDate.getFullYear() &&
                        today.getMonth() === selectedDate.getMonth() &&
                        today.getDate() === selectedDate.getDate();

        if (!isToday) {
          res.current.time = selectedDate.getTime()/1000;
          let mean = res.daily.temperature_2m_mean ? res.daily.temperature_2m_mean[0] : (res.daily.temperature_2m_max[0] + res.daily.temperature_2m_min[0]) / 2;
          res.current.temperature_2m = mean;

          let feelsLike = res.daily.apparent_temperature_mean ? res.daily.apparent_temperature_mean[0] : (res.daily.apparent_temperature_max[0] + res.daily.apparent_temperature_min[0]) / 2;
          res.current.apparent_temperature = feelsLike;
        }
        this.dayForecastSignal.set(res);
        return res;
      })
    );
  }


  private getRawDataPerDay(newDate: Date) {
    let day = newDate.getDate();
    let month = newDate.getMonth() + 1;
    let url = `history/${this.cityService.selectedCity}?dd=${day}&mm=${month}`;
    return this.http.get(url).pipe(
      map((res) => {
          return new DailyHistoryResponse(res);
      }),
      mergeMap((res) => {
        this.currentDD = day;
        this.currentMM = month;
        // check if data of last day is missing
        
        // if day is near get from getDayForecast instead of history
        const dateLimit = new Date();
        dateLimit.setHours(0,0,0);
        dateLimit.setDate(dateLimit.getDate() - 4);
        if (newDate >= dateLimit) {
          return this.getDayForecast(newDate).pipe(
            map((forecastRes: ForecastResponse) => {
              let today = new Date();

              if (res.hasMissingData(newDate) && newDate < today) {
                res = this.mergeForecastAndRawDay(res, forecastRes);
              }
              this.rawDataFromDay = res;
              this.rawDataPerDaySignal.set(res);
              return res;
            })
          );
        }
        this.rawDataFromDay = res;
        this.rawDataPerDaySignal.set(res);
        this.dayForecastSignal.set(res.getForecastFromDate(newDate))
        return of(res);
      })
    );
  }

  private mergeForecastAndRawDay(res: DailyHistoryResponse, forecastRes: ForecastResponse) {
    res.apparent_temperature_max.push(forecastRes.daily.apparent_temperature_max[0]);
    res.apparent_temperature_min.push(forecastRes.daily.apparent_temperature_min[0]);
    res.temperature_2m_max.push(forecastRes.daily.temperature_2m_max[0]);
    res.temperature_2m_min.push(forecastRes.daily.temperature_2m_min[0]);
    res.date?.push(forecastRes.daily.time[0]*1000)
    return res;
  }
}
