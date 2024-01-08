import { Injectable, Signal, effect, inject, signal } from "@angular/core";
import { HttpService } from "./http.service";
import { map, mergeMap, tap } from "rxjs/operators";
import { Observable, of } from "rxjs";
import { DailyHistoryResponse, ForecastResponse } from "../models/forecast-response.model";
import { CitiesStore } from "../../store/cities.store";
import { City } from "../models/city.model";


@Injectable({ providedIn: "root" })
export class ReportsService {
  public rawDataPerDaySignal = signal<DailyHistoryResponse>(new DailyHistoryResponse());
  public dayForecastSignal = signal<ForecastResponse>(new ForecastResponse());
  citiesStore = inject(CitiesStore);

  /*   Move to external file   */
  private forecastApi = `https://api.open-meteo.com/v1/forecast?
latitude={{lat}}&longitude={{long}}
&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m
&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset
&format=json
&start_date={{start_date}}
&end_date={{end_date}}
&timeformat=unixtime`;

  constructor(private http: HttpService) {
  }



  getDataPerDay(newDate: Date, city: City) {
    let day = newDate.getDate();
    let month = newDate.getMonth() + 1;
    let url = `history/${this.citiesStore.selectedCity()}?dd=${day}&mm=${month}`;
    return this.http.get(url).pipe(
      map((res) => {
          return new DailyHistoryResponse(res);
      }),
     
    );
  }


  getDayForecast(selectedDate: Date, latitude: string, longitude: string): Observable<ForecastResponse> {
    let api = this.forecastApi
      .replace("{{lat}}", latitude)
      .replace("{{long}}", longitude)
      .replace("{{start_date}}", selectedDate.toISOString().split("T")[0])
      .replace("{{end_date}}", selectedDate.toISOString().split("T")[0]);
    return this.http.getForecast(api);
  }
  
}
