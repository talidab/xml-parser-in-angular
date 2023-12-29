import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import * as xml2js from 'xml2js';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(private http: HttpClient) { }

  getXmlData(url: string): Observable<string> {
    return this.http.get(url, { responseType: 'text' });
  }

}