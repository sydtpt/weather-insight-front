import { Injectable, effect, signal } from "@angular/core";
import { HttpService } from "./http.service";
import { map, tap } from "rxjs/operators";
import { of } from "rxjs";
import { CityService } from "./city.service";
import { toSignal } from "@angular/core/rxjs-interop";

@Injectable({ providedIn: "root" })
export class ReportsService {
  public getMinAndMaxPerDaySignal: any = signal({});
  public rawDataPerDaySignal: any = signal({});
  public dayForecastSignal = signal({});

  private rawDataFromDay;

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
    effect(() => {
      if(Object.keys(this.rawDataPerDaySignal()).length){
        let temp = this.getMinAndMaxPerDay(this.currentDD, this.currentMM);
        this.getMinAndMaxPerDaySignal.set(temp);
      }
    }, {allowSignalWrites: true});
  }

  getHistoricalDDMM(date: Date) {
    return this.getRawDataPerDay(date);
  }

  private getMinAndMaxPerDay(dd?: string, mm?: string) {
        let minValues: number[] = Object.values(
          this.rawDataFromDay["temperature_2m_min"]
        );
        let min = Math.min(...minValues);
        let roundMin = Math.round(Math.abs(min)); // Arredonda o número para o inteiro mais próximo
        roundMin *= Math.sign(min);
        let minDay = Object.values(
          this.rawDataFromDay["temperature_2m_min"]
        ).findIndex((i) => i === min);
        minDay = this.rawDataFromDay["date"][minDay];

        let maxValues: number[] = Object.values(
          this.rawDataFromDay["temperature_2m_max"]
        );
        let max = Math.max(...maxValues);
        let roundMax = Math.round(Math.abs(max)); // Arredonda o número para o inteiro mais próximo
        roundMax *= Math.sign(max);
        let maxDay = Object.values(
          this.rawDataFromDay["temperature_2m_max"]
        ).findIndex((i) => i === max);
        maxDay = this.rawDataFromDay["date"][maxDay];
        let avgs: any = Object.values(
          this.rawDataFromDay["temperature_2m_mean"]
        );

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

  getDayForecast(date: Date) {
    let today = new Date()
    today.setHours(0, 0, 0)
    // should get from raw history data if date < today
    if (date < today) {
      // this.rawDataPerDaySignal.set(this.rawDataPerDaySignal())
      return this.getRawDataPerDay(date).pipe(
        tap((res:any) => {
          let day = date.toISOString().slice(0,10);
          let values = Object.values(res.date).map((item:any) =>  new Date(item).toISOString().slice(0,10));
          let id = values.findIndex((i:any) => new Date(i).toISOString().slice(0,10) === day)
          let avg = {
            daily: {
              temperature_2m_min: res.temperature_2m_min[id],
              temperature_2m_max: res.temperature_2m_max[id],
              sunrise: res.sunrise[id],
              sunset: res.sunset[id],
              apparent_temperature: res.apparent_temperature_mean[id],
              time: date
            },
            current: {
              weather_code: res.weather_code[id],
              temperature_2m: res.temperature_2m_mean[id],
              relative_humidity_2m: [0],
              wind_speed_10m: res.wind_speed_10m_max[id],
              apparent_temperature: res.apparent_temperature_mean[id],
            },
          }
          this.dayForecastSignal.set(avg)}
      ));
    }
    let coords = this.cityService.getCityLatLon();
    let api = this.forecastApi
      .replace("{{lat}}", coords.latitude)
      .replace("{{long}}", coords.longiture)
      .replace("{{start_date}}", date.toISOString().split('T')[0])
      .replace("{{end_date}}", date.toISOString().split('T')[0]);
    return this.http
      .get(api)
      .pipe(tap((res) => {
        this.dayForecastSignal.set(res)
      }));
  }

  private getRawDataPerDay(date: Date) {
    let day = date.getDate(); 
    let month = date.getMonth()+1;
    if (
      !this.rawDataFromDay ||
      day !== this.currentDD ||
      month !== this.currentMM
    ) {
      let url = `http://127.0.0.1:5000/api/history/${this.cityService.selectedCity}`;
      url = (day && month) ? `${url}?dd=${day}&mm=${month}` : url;
      return this.http.get(url).pipe(
        map((res) => {
          this.currentDD = day;
          this.currentMM = month;
          this.rawDataFromDay = res;
          this.rawDataPerDaySignal.set(res);
          return res;
        })
      );
    }
    return of(this.rawDataFromDay);
  }
}
