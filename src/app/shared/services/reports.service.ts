import { Injectable } from "@angular/core";
import { HttpService } from "./http.service";
import { map } from "rxjs/operators";
import { of } from "rxjs";
import { CityService } from "./city.service";

@Injectable({ providedIn: "root" })
export class ReportsService {
  private rawDataFromDay;
  private currentDD;
  private currentMM;

  /*   Move to external file   */
  private forecastApi = `https://api.open-meteo.com/v1/forecast?
latitude={{lat}}&longitude={{long}}
&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code
&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,
&format=json
&start_date={{start_date}}
&end_date={{end_date}}
&timeformat=unixtime`
  
  constructor(private http: HttpService, private cityService: CityService) {}

  getHistoricalDDMM(dd?: string, mm?: string) {
    return this.getRawDataPerDay(dd, mm);
  }

  getMinAndMaxPerDay(dd?: string, mm?: string) {
   return this.getRawDataPerDay(dd, mm).pipe(
      map(() => {

         let minValues: number[] = Object.values(this.rawDataFromDay["temperature_2m_min"]);
         let min = Math.min(...minValues)
         let roundMin = Math.round(Math.abs(min)); // Arredonda o número para o inteiro mais próximo
         roundMin *= Math.sign(min);
         let minDay = Object.values(this.rawDataFromDay["temperature_2m_min"]).findIndex( i => i === min);
         minDay = this.rawDataFromDay["date"][minDay];

         let maxValues: number[] = Object.values(this.rawDataFromDay["temperature_2m_max"]);
         let max = Math.max(...maxValues)
         let roundMax = Math.round(Math.abs(max)); // Arredonda o número para o inteiro mais próximo
         roundMax *= Math.sign(max);
         let maxDay = Object.values(this.rawDataFromDay["temperature_2m_max"]).findIndex( i => i === max);
         maxDay = this.rawDataFromDay["date"][maxDay];
         let avgs:any = Object.values(this.rawDataFromDay["temperature_2m_mean"])
       
         const LIMIT_AVG_YEARS = 20;
         avgs = avgs.slice(avgs.length - LIMIT_AVG_YEARS, avgs.length +1);

         let avg = avgs.reduce((sum: any, d) => sum + d, 0) / avgs.length;
         let temp = {
            min: roundMin,
            max: roundMax,
            minDay: new Date(minDay).getFullYear(),
            maxDay: new Date(maxDay).getFullYear(),
            avg: avg
         }
         return temp;
      })
    );
  }

  getDayForecast(date?: string) {
   let coords = this.cityService.getCityLatLon();
   let api = this.forecastApi
     .replace("{{lat}}", coords.latitude)
     .replace("{{long}}", coords.longiture)
     .replace("{{start_date}}","2024-01-04")
     .replace("{{end_date}}","2024-01-04");
   return this.http.get(api);
  }

  private getRawDataPerDay(dd?: string, mm?: string) {
   if (!this.rawDataFromDay || dd !== this.currentDD || mm !== this.currentMM) {
      let url = `http://127.0.0.1:5000/api/history/${this.cityService.selectedCity}`;
      url = dd && mm ? `${url}?dd=${dd}&mm=${mm}` : url;
      return this.http.get(url).pipe(
        map((res) => {
          this.currentDD = dd;
          this.currentMM = mm;
          this.rawDataFromDay = res;
          return res;
        })
      );
   }
   return of(this.rawDataFromDay);
  }



}
