import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({providedIn: 'root'})
export class HttpService {
    constructor(private http: HttpClient) {

     }

     get(url: string, opt?: any) {
        return this.http.get(url, opt);
     }
    
}