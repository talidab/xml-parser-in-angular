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

  animalAttacks: any[] = [];
  incompatibleAnimals: any[] = [];

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
        let noOfHabitats: number = 0;
        for (const habitat of data.gradina_zoologica.habitate.habitat){
          this.habitats[noOfHabitats] = habitat.nume;
          noOfHabitats ++;
        }
        this.animalAttacks = data.gradina_zoologica.atacuri.ataca;
        // console.log(this.animalAttacks);
      }
    });
  }



  getAnimals(): void {
    this.finalAnimals = [];
    
    if (this.selectedDiet && this.selectedHabitat) {
      this.displayError = false;
      this.animals = this.findCommonElements(this.animalMatchesDiet(this.selectedDiet), this.animalMatchesHabitat(this.selectedHabitat));
      this.getAnimalsClicked = true;
      if(this.animals.length === 0){
        this.displayMessage = 'Nu exista animale pentru criteriile selectate';
        this.noAnimals = true;
      }
      else {
        let noOfAnimals: number = 0;
        for (const animal of this.animals){
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
        this.noAnimals = false;
      }
    } else {
      this.displayError = true;
      this.errorMessage = 'Selecteaza si dieta si habitatul!';
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

  getIncompatibleAnimals(): void {
    // Assuming you have a method to fetch incompatible animals
    this.animalAttacks.forEach((attack: any) => {
      const attacker = attack.atacator;
      const target = attack.tinta;

      // Check if the attacker and target are not compatible
      if (!this.areAnimalsCompatible(attacker, target)) {
        this.addIncompatibleAnimal(attacker);
        this.addIncompatibleAnimal(target);
      }
    });
  }

  private addIncompatibleAnimal(animalName: string): void {
    const existingAnimal = this.incompatibleAnimals.find((animal) => animal.name === animalName);

    if (!existingAnimal) {
      // Assuming you have a method to get the image URL for the animal
      this.incompatibleAnimals.push({ name: animalName, imageUrl: '/assets/lion/jpg' });
    }
  }

  private areAnimalsCompatible(animal1: string, animal2: string): boolean {
    // Iterate through the list of incompatible animal pairs
    for (const attack of this.animalAttacks) {
      const attacker = attack.atacator;
      const target = attack.tinta;
  
      // Check if the given animals match any incompatible pair
      if (
        (animal1 === attacker && animal2 === target) ||
        (animal1 === target && animal2 === attacker)
      ) {
        return false; // Animals are incompatible
      }
    }
  
    return true; // No incompatibility found
  }
  
}
