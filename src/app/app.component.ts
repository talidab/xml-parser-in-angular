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
  allAnimals: any[] = [];
  habitats: any[] = [];

  selectedDiet: string = '';
  selectedHabitat: string = '';

  getAnimalsClicked: boolean = false;

  imageWidth: number = 150; 
  imageHeight: number = 110; 

  errorMessage: string = '';
  displayError: boolean = false;
  displayMessage: string = '';
  noAnimals: boolean = false;

  incompatibleAnimals: any[] = [];

  selectedAnimal1: string = '';
  selectedAnimal2: string = '';
  compatibilityResult: string | undefined;
  compatibilityResultColor: string = '';

  selectedAnimal3: string = '';
  foodResult: string | undefined;

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

        let noOfAnimals = 0;
        for(const animal of data.gradina_zoologica.animale.animal) {
          this.allAnimals[noOfAnimals] = animal.nume;
          noOfAnimals ++;
        }

        this.incompatibleAnimals = data.gradina_zoologica.atacuri.ataca;
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

  checkCompatibility(): void {
    if (this.selectedAnimal1 && this.selectedAnimal2) {
      this.compatibilityResult = this.areAnimalsCompatible(this.selectedAnimal1, this.selectedAnimal2)
        ? 'Animalele selectate nu se ataca intre ele.'
        : 'Animalele selectate se ataca intre ele.';
        this.compatibilityResultColor = this.areAnimalsCompatible(this.selectedAnimal1, this.selectedAnimal2) ? 'green' : '#b61414';
    } else {
      this.compatibilityResult = 'Selecteaza ambele animale pentru a verifica compatibilitatea.';
      this.compatibilityResultColor = '#b61414';
    }
  }

  areAnimalsCompatible(animal1: string, animal2: string): boolean {
    const incompatiblePair = this.incompatibleAnimals.find(pair =>
      (pair.atacator === animal1 && pair.tinta === animal2) ||
      (pair.atacator === animal2 && pair.tinta === animal1)
    );
  
    return !incompatiblePair;
  }


  
  getAnimalFoodType(animalName: string): string {
    for (const foodType of this.jsonData.gradina_zoologica.hranire.hrana) {
      if (Array.isArray(foodType.animale.animal) && foodType.animale.animal.includes(animalName)) {
        return foodType.tip;
      } else if (foodType.animale.animal === animalName) {
        return foodType.tip;
      }
    }
    return 'Necunoscut';
  }

  checkFoodType(): void {
    if (this.selectedAnimal3) {
      this.foodResult = this.getAnimalFoodType(this.selectedAnimal3);
    } else {
      this.foodResult = 'Nu exista hrana inregistrata pentru acest animal';
    }
  }
  
}
