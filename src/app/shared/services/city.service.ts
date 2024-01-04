import { Injectable } from '@angular/core';

@Injectable({providedIn: 'root'})
export class CityService {

    cities = [{
        city_code: "brussels",
        description: "Bruxelas",
        img: "assets/img/brussels.jpg",
        latitude: 50.8505,
        longiture: 4.3488,
    },{
        city_code: "sao_paulo",
        description: "São Paulo",
        img: "assets/img/brussels.jpg",
        longiture: 0,
        latitude: 0
    }];

    public selectedCity = "";
    constructor() { }


    public exist(city_code: string){
        return !!this.cities.find(i => city_code === i.city_code);
    }

    getCityLatLon(city_code?: string) {
        if (!city_code) {
            city_code = this.selectedCity
        }
        let temp: any = this.cities.find(i => i.city_code === city_code);
        temp = temp ? temp : {latitude: 0, longiture: 0};
        return {
            latitude: temp.latitude,
            longiture: temp.longiture
        };
    }
}