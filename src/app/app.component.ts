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


  diets: any[] = [];
  animals: any[] = [];
  habitats: any[] = [];

  selectedDiet: string = '';
  selectedHabitat: string = '';

  getAnimalsClicked: boolean = false;

  errorMessage: string = '';
  displayError: boolean = false;
  displayMessage: string = '';
  noAnimals: boolean = false;

  constructor(private appService: AppService) {}

  ngOnInit(): void {
    const xmlUrl = 'assets/baza-de-cunostinte.xml';
    this.appService.getXmlData(xmlUrl).subscribe((data: any) => {
      this.xmlString = data;
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
        let noOfDiets: number = 0;
        for (const diet of data.gradina_zoologica.diete.dieta){
          this.diets[noOfDiets] = diet.tip;
          noOfDiets ++;
        }
        // console.log(this.diets);
        let noOfHabitats: number = 0;
        for (const habitat of data.gradina_zoologica.habitate.habitat){
          this.habitats[noOfHabitats] = habitat.nume;
          noOfHabitats ++;
        }
      }
    });
  }



  getAnimals(): void {
    console.log('Selected Diet:', this.selectedDiet);
    console.log('Selected Habitat:', this.selectedHabitat);
    
    if (this.selectedDiet && this.selectedHabitat) {
      this.displayError = false;
      this.animals = this.findCommonElements(this.animalMatchesDiet(this.selectedDiet), this.animalMatchesHabitat(this.selectedHabitat));
      this.getAnimalsClicked = true;
      if(this.animals.length === 0){
        this.displayMessage = 'Nu exista animale pentru criteriile selectate';
        this.noAnimals = true;
      }
      else {
        this.noAnimals = false;
      }
    } else {
      this.displayError = true;
      this.errorMessage = 'Please select both diet and habitat before getting animals!';
    }
  }
  
  findCommonElements(array1: any[], array2: any[]) {
    return array1.filter(value => array2.includes(value));
  }

  private animalMatchesDiet(selectedDiet: string): any[] {
    let foundAnimals: any[] = [];

    for (const diet of this.jsonData.gradina_zoologica.diete.dieta) {
      if (diet.tip === selectedDiet) {
        if (Array.isArray(diet.animale.animal)) {
          foundAnimals = diet.animale.animal;
        } else {
          foundAnimals = [diet.animale.animal];
        }
      } else {
        console.log("Invalid diet.");
      }
    }

    return foundAnimals;
  }

  private animalMatchesHabitat(selectedHabitat: string): any[] {
    let foundAnimals: any[] = [];
  
    for (const habitat of this.jsonData.gradina_zoologica.habitate.habitat) {
      if (habitat.nume === selectedHabitat) {
        if (Array.isArray(habitat.animale.animal)) {
          foundAnimals = habitat.animale.animal;
        } else {
          foundAnimals = [habitat.animale.animal];
        }
      } else {
        console.log("Invalid diet.");
      }
    }

    return foundAnimals;
  }
  
}
