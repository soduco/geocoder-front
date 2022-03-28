import { Component, NgModule, OnInit } from '@angular/core';
import { AdressesService } from '../adresses.service';
import {  AfterViewInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ApiService } from '../api.service';
import { CsvDataGeo } from '../csv/csv.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-geocodeur',
  templateUrl: './geocodeur.component.html',
  styleUrls: ['./geocodeur.component.css']
})


export class GeocodeurComponent implements  OnChanges {
  @Input() public parent: any; 
  
  public csv_valid!: boolean;
  display_button_exp:boolean = false;
  display_button_geo : boolean = true;
  public geocodage_done:boolean = false;
  selected_nb= 1;
  public chargement:boolean=false;




  constructor(private AdressesService:AdressesService, public apiService: ApiService,) { }
  
  selectChangeHandler (event: any) {
    this.selected_nb = event.target.value;
  }
  ngOnChanges(changes: SimpleChanges): void {

    this.csv_valid = changes['parent'].currentValue;
    if (this.csv_valid == true){
      this.display_button_geo=false;
    }
  }

  sleep(ms : number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }


  async geocodage() {
    this.chargement=true;

    await this.sleep(1000);

    const adresses = this.AdressesService.getAdresse();

    for (let x = 0 ; x<adresses.length ; x++){
      
      this.apiService.getAdress(adresses[x].text, adresses[x].startingTime, adresses[x].endingTime, adresses[x].softTime,this.selected_nb).subscribe(response => {
        for(let i = 0; i<this.selected_nb; i++){ 
     
          const dataGeo: CsvDataGeo = new CsvDataGeo();
          dataGeo.text = adresses[x].text
          dataGeo.startingTime = adresses[x].startingTime 
          dataGeo.endingTime = adresses[x].endingTime
          dataGeo.softTime = adresses[x].softTime
          dataGeo.lat = response.features[i].geometry.coordinates[1].toString();
          dataGeo.long=response.features[i].geometry.coordinates[0].toString();
          dataGeo.rang=(i+1).toString();
          this.AdressesService.addAdresseGeo(dataGeo);
        }
      });
  }
    this.display_button_exp=true;
    this.geocodage_done=true;
    this.chargement=false;
  }
}
