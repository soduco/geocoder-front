import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ParametreAvanceService {

  public number:number = 5;

  constructor() { }

  setNumber(number:number){
    this.number = number;
  }

  getNumber(){
    return this.number;
  }
}
