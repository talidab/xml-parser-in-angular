import { Component } from '@angular/core';
import { AppService } from './app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'tema2';
  data: any;
  xmlContent = '';

  constructor(private appService: AppService) {
  
  }

  ngOnInit(): void {
    this.loadData();
  }

  xmlFilePath: string = 'assets/baza-de-cunostinte.xml';

  async loadData() {
    try {
      this.data = await this.appService.parseXML(this.xmlFilePath);
      console.log('XML Data:', JSON.stringify(this.data));
    } catch (error) {
      console.error('Error loading XML data:', error);
    }
  }
}
