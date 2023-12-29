import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import * as xml2js from 'xml2js';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(private http: HttpClient) { }

  parseXML(filePath: string): Observable<any> {
    return this.http.get(filePath, { responseType: 'text' }).pipe(
      map(xmlString => this.convertXmlToJson(xmlString))
    );
  }

  private convertXmlToJson(xmlString: string): Observable<any> {
    return new Observable((observer) => {
      const parser = new xml2js.Parser({ explicitArray: false });
      parser.parseString(xmlString, (err, result) => {
        if (err) {
          observer.error(err);
        } else {
          observer.next(result);
          observer.complete();
        }
      });
    });
  }
}