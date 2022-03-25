import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { url } from 'inspector';
import { Observable, of } from 'rxjs';
import { CsvData, CsvDataGeo } from './csv/csv.component';



@Injectable({
  providedIn: 'root'
})
export class AdressesService {

  adresses: CsvData[]=  [];
  adresses_geo : CsvDataGeo[]= [];
  

  constructor(private http: HttpClient) { }

  addAdresse(adress:CsvData){
    this.adresses.push(adress) 
  }

  getAdresse(){
    return this.adresses
  }

  addAdresseGeo(adressGeo : CsvDataGeo) {
    this.adresses_geo.push(adressGeo)   
  }

  getAdresseGeo() {
    return of(this.adresses_geo)
  }
}
