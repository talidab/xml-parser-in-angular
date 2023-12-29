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
  jsonData: any;

  buttonLabel: string = 'Apasa aici pentru a vedea ce animale se afla la gradina zoologica';
  getAnimalsClicked: boolean = false;

  constructor(private appService: AppService) {}

  ngOnInit(): void {
    const xmlUrl = 'assets/baza-de-cunostinte.xml';
    this.appService.getXmlData(xmlUrl).subscribe((data: any) => {
      this.xmlString = data;
      // console.log(this.xmlString); 
      this.parseXmlString();
    });
    
  }

  private parseXmlString(): void {
    xml2js.parseString(this.xmlString, { explicitArray: false }, (error, data) => {
      if (error) {
        console.error('Error parsing XML:', error);
      } else {
        this.jsonData = data;
        console.log(this.jsonData);
      }
    });
  }

  animals: any[] = [];

  getAnimals(): void {
    this.getAnimalsClicked = true;
    this.animals = this.jsonData.gradina_zoologica.animale.animal;
    console.log(this.animals);
    for (const animal of this.animals){
      console.log(animal.nume);
    }
  }

  displayMessage: string = '';
}