import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { tap } from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class CityService {

    cities:any = [];

    public selectedCity = "";
    constructor(private httpService: HttpService) { }


    public exist(city_code: string){
        return !!this.cities.find(i => city_code === i.city_code);
    }

    getCityLatLon(city_code?: string) {
        if (!city_code) {
            city_code = this.selectedCity
        }
        let temp: any = this.cities.find(i => i.city_code === city_code);
        temp = temp ? temp : {latitude: 0, longitude: 0};
        return {
            latitude: temp.latitude,
            longiture: temp.longitude
        };
    }

    getCities() {
        return this.httpService.get("cities").pipe(tap(cities => this.cities = cities["cities"]))
    }

    getTimeZone() {
        let temp: any = this.cities.find(i => i.city_code === this.selectedCity);
        return temp ? temp.timezone : "";
    }
}