import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { CsvData, CsvDataGeo } from './csv/csv.component';

@Injectable({
  providedIn: 'root'
})
export class AdressesService {

  adresses: CsvData[]=  [];
  adresses_geo : CsvDataGeo[]= [];
  
  constructor() { }

  setDatasetGeo(full_database_geo : CsvDataGeo[]){
    this.adresses_geo = full_database_geo
  }
  addAdresse(adress:CsvData){
    this.adresses.push(adress) 
  }

  getAdresse(){
    return this.adresses
  }

  addAdresseGeo(adressGeo : CsvDataGeo) {
    this.adresses_geo.push(adressGeo)   
  }

  getAdresseGeo() : Observable<CsvDataGeo[]> {
    return of(this.adresses_geo)
  }

  getAdresseGeoByRang(selected_rang : number) : Observable<CsvDataGeo[]> {
    const adresses_selected: CsvDataGeo[] = [];

    for (let ad of this.adresses_geo){
      if (ad.rang == selected_rang){
        adresses_selected.push(ad)
      }
    }
    return of(adresses_selected)
  }

  getAdresseGeoByAdresse(adresse : string): Observable<CsvDataGeo[]> {
    const adresses_selected: CsvDataGeo[] = [];
    for (let ad of this.adresses_geo){
      if (ad.text == adresse){
        adresses_selected.push(ad)
      }
    }
  return of(adresses_selected)
  }

  changeAdresseRang(adresse : string, old_rank : string, new_rank : string){
    for (let ad of this.adresses_geo){
      if (ad.text == adresse && ad.rang == old_rank){
        ad.rang = new_rank
      }
    }
  }

  cleanAdresseGeo(){
    this.adresses_geo = [];
  }
}
