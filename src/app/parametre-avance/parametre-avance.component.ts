import { ApiService } from './../api.service';
import { Component } from '@angular/core';
import { ParametreAvanceService } from '../parametre-avance.service';

@Component({
  selector: 'app-parametre-avance',
  templateUrl: './parametre-avance.component.html',
  styleUrls: ['./parametre-avance.component.css']
})

export class ParametreAvanceComponent {

  public numbers = [1,2,3,4,5,6,7,8,9,10];

  public selected_nb:number = 5;

  constructor( public parametreService: ParametreAvanceService) {  };

  selectChangeHandler(number: number){
    this.selected_nb = number;
    this.parametreService.setNumber(number);
  }

}
