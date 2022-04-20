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
    let adresses_selected_final: CsvDataGeo[] = [];
    for (let ad of this.adresses_geo){
      if (ad.text == adresse && ad.startingTime == startingTime && ad.endingTime == endingTime){
        adresses_selected.push(ad)
      }
    }
    adresses_selected_final.push(adresses_selected[0]) // on ajoute le premier element 

    for (let i=1;i<adresses_selected.length;i++){
      for (let y=0;y<adresses_selected_final.length;y++){
        if (adresses_selected[i].rang == adresses_selected_final[y].rang){
          break
        }
        if (adresses_selected[i].rang != adresses_selected_final[y].rang && y==adresses_selected_final.length-1){
          adresses_selected_final.push(adresses_selected[i])
        }
      }

    }
   

  return of(adresses_selected_final)
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
