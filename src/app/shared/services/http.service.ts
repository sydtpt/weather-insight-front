import { HttpClient, HttpParamsOptions } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ForecastResponse } from '../models/forecast-response.model';

@Injectable({providedIn: 'root'})
export class HttpService {

   private readonly URL = "http://127.0.0.1:5000/api/";

    constructor(private http: HttpClient) {

     }

     get(endpoint: string, opt?: any): Observable<any> {
        return this.http.get(this.URL + endpoint);
     }

     getForecast(endpoint: string, opt?): Observable<ForecastResponse> {
      return this.http.get<ForecastResponse>(endpoint);
   }
}