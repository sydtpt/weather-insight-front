import { HttpClient, HttpParamsOptions } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, map } from "rxjs";
import { ForecastResponse } from "../models/forecast-response.model";

@Injectable({ providedIn: "root" })
export class HttpService {
  private readonly URL = "http://127.0.0.1:5000/api/";

  constructor(private http: HttpClient) {}

  get(endpoint: string, opt?: any): Observable<any> {
    return this.http.get(this.URL + endpoint)
  }

  getForecast(endpoint: string, opt?): Observable<ForecastResponse> {
    return this.http.get(endpoint).pipe(
      map((res) => {
        res["current"].time = new Date(res["current"].time * 1000)
        res["daily"].sunrise = res["daily"].sunrise.map(
          (i) => new Date(i * 1000)
        );
        res["daily"].sunset = res["daily"].sunset.map(
          (i) => new Date(i * 1000)
        );
        res["daily"].time = res["daily"].time.map((i) => new Date(i * 1000));
        return <ForecastResponse>res;
      })
    );
  }
}
