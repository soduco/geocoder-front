import { Component, OnInit } from '@angular/core';
import { AdressesService } from '../adresses.service';
import {  AfterViewInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ApiService } from '../api.service';
import { CsvDataGeo } from '../csv/csv.component';


@Component({
  selector: 'app-geocodeur',
  templateUrl: './geocodeur.component.html',
  styleUrls: ['./geocodeur.component.css']
})

export class GeocodeurComponent implements  AfterViewInit, OnChanges {
  @Input() public parent: any; 
  
  public csv_valid!: boolean;
  display_button_exp:boolean = false;
  display_button_geo : boolean = true;
  public geocodage_done:boolean = false;

  
  constructor(private AdressesService:AdressesService, public apiService: ApiService,) { }
  

  ngOnChanges(changes: SimpleChanges): void {

    this.csv_valid = changes['parent'].currentValue;
    if (this.csv_valid == true){
      this.display_button_geo=false;
    }
  }

  ngAfterViewInit(): void {
    throw new Error('Method not implemented.');
  }

  ngOnInit(): void {
  }

  geocodage() {
    
    const adresses = this.AdressesService.getAdresse();

    for (let x = 0 ; x<3 ; x++){
      
      this.apiService.getAdress(adresses[x].text, adresses[x].startingTime, adresses[x].endingTime, adresses[x].softTime).subscribe(response => {
        for(let i = 0; i<1; i++){ 
     
          const dataGeo: CsvDataGeo = new CsvDataGeo();
          dataGeo.text = adresses[x].text
          dataGeo.startingTime = adresses[x].startingTime 
          dataGeo.endingTime = adresses[x].endingTime
          dataGeo.softTime = adresses[x].softTime
          dataGeo.lat = response.features[i].geometry.coordinates[1].toString();
          dataGeo.long=response.features[i].geometry.coordinates[0].toString();
          this.AdressesService.addAdresseGeo(dataGeo);
        }
      });
  }
    this.display_button_exp=true;
    this.geocodage_done=true;
  }
}
