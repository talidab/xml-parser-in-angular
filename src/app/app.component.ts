import { Component } from '@angular/core';
import { AppService } from './app.service';
import * as xml2js from 'xml2js';

interface Animal {
  nume: string;
  imageUrl: string;
}

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

  imageWidth: number = 150; // Set the desired width
  imageHeight: number = 110; // Set the desired height

  errorMessage: string = '';
  displayError: boolean = false;
  displayMessage: string = '';
  noAnimals: boolean = false;

  finalAnimals: Animal[] = [{
    nume: 'leu',
    imageUrl: '/assets/lion.jpg'
  }];

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
        console.log(this.finalAnimals[0].nume);
      }
    });
  }



  getAnimals(): void {
    console.log('Selected Diet:', this.selectedDiet);
    console.log('Selected Habitat:', this.selectedHabitat);
    this.finalAnimals = [];
    
    if (this.selectedDiet && this.selectedHabitat) {
      this.displayError = false;
      console.log("dieta:\n");
      console.log(this.animalMatchesDiet(this.selectedDiet));
      console.log('habitat:\n');
      console.log(this.animalMatchesHabitat(this.selectedHabitat));
      this.animals = this.findCommonElements(this.animalMatchesDiet(this.selectedDiet), this.animalMatchesHabitat(this.selectedHabitat));
      console.log('la comun:\n');
      console.log(this.animals);
      this.getAnimalsClicked = true;
      if(this.animals.length === 0){
        this.displayMessage = 'Nu exista animale pentru criteriile selectate';
        this.noAnimals = true;
      }
      else {
        let noOfAnimals: number = 0;
        for (const animal of this.animals){
          console.log(animal);
          if (!this.finalAnimals[noOfAnimals]) {
            this.finalAnimals[noOfAnimals] = {
              nume: '',
              imageUrl: ''
            };
          }
          this.finalAnimals[noOfAnimals].nume = animal.nume;
          this.finalAnimals[noOfAnimals].imageUrl = animal.image;
          noOfAnimals ++;
        }
        console.log(this.finalAnimals);
        this.noAnimals = false;
      }
    } else {
      this.displayError = true;
      this.errorMessage = 'Please select both diet and habitat before getting animals!';
    }
  }
  
  findCommonElements(array1: any[], array2: any[]): any[] {
    return array1.filter(animal1 =>
      array2.some(animal2 => animal2.nume === animal1.nume)
    );
  }
  
  private animalMatchesDiet(selectedDiet: string): any[] {
    let foundAnimals: any[] = [];

    for (const diet of this.jsonData.gradina_zoologica.diete.dieta) {
      if (diet.tip === selectedDiet) {
        if (Array.isArray(diet.animale.animal)) {
          foundAnimals = diet.animale.animal;
          console.log(foundAnimals);
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
