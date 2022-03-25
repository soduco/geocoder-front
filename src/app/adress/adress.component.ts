
import { Component, OnInit } from '@angular/core';
import { AdressesService } from '../adresses.service';

@Component({
  selector: 'adress',
  styleUrls: ['./adress.component.css'],
  template: `
    <h1> {{ adresse }} </h1>
    `
})
export class AdressComponent {

  adresse: any;

  constructor(service: AdressesService) { 
    this.adresse = service.getAdresse();
  }
}
