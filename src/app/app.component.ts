import { Component } from '@angular/core';
import { AppService } from './app.service';
import * as xml2js from 'xml2js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  xmlString: string = '';

  constructor(private appService: AppService) {}

  ngOnInit(): void {
    const xmlUrl = 'assets/baza-de-cunostinte.xml';
    this.appService.getXmlData(xmlUrl).subscribe((data) => {
      this.xmlString = data;
      console.log(this.xmlString); // Output the XML string

      // Parse XML string to JSON
      this.parseXmlString();
    });
  }

  private parseXmlString(): void {
    xml2js.parseString(this.xmlString, { explicitArray: false }, (error, data) => {
      if (error) {
        console.error('Error parsing XML:', error);
      } else {
        const jsonData = data;
        console.log(jsonData); // Output the parsed JSON data
      }
    });
  }
}