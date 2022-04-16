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
    if (selected_rang == 0){
      return of(this.adresses_geo)
    }
    for (let ad of this.adresses_geo){
      if (ad.rang == selected_rang){
        adresses_selected.push(ad)
      }
    }
    return of(adresses_selected)
  }

  getAdresseGeoByAdresse(adresse : string,startingTime : string,endingTime : string): Observable<CsvDataGeo[]> {
    let adresses_selected: CsvDataGeo[] = [];
    
    for (let ad of this.adresses_geo){
      if (ad.text == adresse && ad.startingTime == startingTime && ad.endingTime == endingTime){
        adresses_selected.push(ad)
      }
    }

    for (let i=0;i<adresses_selected.length;i++){
      for (let y=0;y<adresses_selected.length;y++){
        if (i == y ){
          continue
        }
        if (i !=y && adresses_selected[i].rang == adresses_selected[y].rang ){
          const index = adresses_selected.indexOf(adresses_selected[i]);
          if (index > -1) {
            adresses_selected.splice(index, 1); // 2nd parameter means remove one item only
          }
        }
      }
    }
   

  return of(adresses_selected)
  }

  changeAdresseRang(adresse : string,startingTime:string,endingTime:string, old_rank : string, new_rank : string){
    for (let ad of this.adresses_geo ){
      if (ad.text == adresse && ad.startingTime == startingTime && ad.endingTime == endingTime && ad.rang == old_rank){
        ad.rang = new_rank
      }
    }
  }

  cleanAdresseGeo(){
    this.adresses_geo = [];
  }
  cleanAdresse(){
    this.adresses = []
  }
}
