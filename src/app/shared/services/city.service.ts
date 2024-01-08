import { Injectable, inject } from '@angular/core';
import { HttpService } from './http.service';
import { map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { City } from '../models/city.model';

@Injectable({providedIn: 'root'})
export class CityService {

    constructor(private httpService: HttpService) { }


    getCities(): Observable<City[]> {
        return this.httpService.get("cities").pipe(map(cities => {
            return cities["cities"];
        }))
    }

}