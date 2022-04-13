import { Component,  NgModule, EventEmitter, OnInit, Output } from '@angular/core';

import { AdressesService } from '../adresses.service';
import { Input, OnChanges, SimpleChanges } from '@angular/core';
import { ApiService } from '../api.service';
import { CsvDataGeo } from '../csv/csv.component';
import { CsvServiceService } from '../csv-service.service';


@Component({
  selector: 'app-geocodeur',
  templateUrl: './geocodeur.component.html',
  styleUrls: ['./geocodeur.component.css']
})


export class GeocodeurComponent implements  OnChanges {
  @Input() public parent: any; 
  
  @Output() public enfant = new EventEmitter<boolean>();

  public isClicked: boolean = false;
  public csv_valid!: boolean;
  display_button_exp:boolean = false;
  display_button_geo : boolean = true;
  public geocodage_done:boolean = false;
  selected_nb= 5;
  public chargement:boolean=false;
  public numbers = [1,2,3,4,5,6,7,8,9,10];
  public nb! : number;

  constructor(private AdressesService:AdressesService, public apiService: ApiService,public csvService: CsvServiceService) { }
  
  selectChangeHandler (number: number) {
    this.selected_nb = number;
    console.log(this.selected_nb);
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

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }

  
  /**
   * Function to use when the api.service will be in charge of multiple requests.
   */
  async geocodage2(){
    let full_database : CsvDataGeo[]=[]
    full_database = await this.geocodeAdresses()
    
    this.AdressesService.setDatasetGeo(full_database)
    this.display_button_exp=true;
    this.geocodage_done=true;
    this.chargement=false;
    
  }
  
  /**
   * Function to use when the api.service will be in charge of multiple requests. And not only one request is being handle.
   * @returns Promise : return the promsie of the full dataset 
   */
  async geocodeAdresses() : Promise<CsvDataGeo[]> {

    return new Promise((resolve, reject) => {
      this.AdressesService.cleanAdresseGeo()
      

      this.chargement=true;
      
      this.enfant.emit(this.isClicked);
      const adresses = this.AdressesService.getAdresse();
      let nb_max = 0
      let full_database: CsvDataGeo[]=[];
      for (let x = 0 ; x<adresses.length ; x++){
        if (adresses[x].text.trim().length == 0){
          continue 
        }

        this.apiService.getAdress(adresses[x].text, adresses[x].startingTime, adresses[x].endingTime, adresses[x].softTime, this.selected_nb).subscribe(async (response) => {
        
          //const response = await this.apiService.getAdress(adresses[x].text, adresses[x].startingTime, adresses[x].endingTime, adresses[x].softTime, this.selected_nb).toPromise().catch(this.handleError);;

          for (let i = 0; i < this.selected_nb; i++) {
            try {
              const dataGeo: CsvDataGeo = new CsvDataGeo();
              dataGeo.row_data = this.csvService.getCsvDataById(x);
              dataGeo.text = adresses[x].text;
              dataGeo.startingTime = adresses[x].startingTime;
              dataGeo.endingTime = adresses[x].endingTime;
              dataGeo.softTime = adresses[x].softTime;
              dataGeo.lat = response.features[i].geometry.coordinates[1].toString();
              dataGeo.long = response.features[i].geometry.coordinates[0].toString();
              console.log(response[i])
              dataGeo.rang = (i + 1).toString();
              full_database.push(dataGeo)
              nb_max += 1;
            } catch (error) {
              continue;
            }
          }
        })
        resolve(full_database);
      }
    })
  }


  /**
   * Function used when the button "geocodage" is presssed. It will fill the apiService by all the results. 
   */
  async geocodage() {
    this.AdressesService.cleanAdresseGeo()
    this.chargement=true;

    this.enfant.emit(this.isClicked);
    const adresses = this.AdressesService.getAdresse();
    let nb_max = 0
    for (let x = 0 ; x<adresses.length ; x++){
      if (adresses[x].text.trim().length == 0){
        continue 
      }
      //depreciated 
      //const response = await this.apiService.getAdress(adresses[x].text, adresses[x].startingTime, adresses[x].endingTime, adresses[x].softTime, this.selected_nb).toPromise();
      this.apiService.getAdress(adresses[x].text, adresses[x].startingTime, adresses[x].endingTime, adresses[x].softTime, this.selected_nb).subscribe(async (response) => {
      
        //const response = await this.apiService.getAdress(adresses[x].text, adresses[x].startingTime, adresses[x].endingTime, adresses[x].softTime, this.selected_nb).toPromise().catch(this.handleError);;

        for (let i = 0; i < this.selected_nb; i++) {
          try {
            const dataGeo: CsvDataGeo = new CsvDataGeo();
            dataGeo.row_data = this.csvService.getCsvDataById(x);
            dataGeo.text = adresses[x].text;
            dataGeo.startingTime = adresses[x].startingTime;
            dataGeo.endingTime = adresses[x].endingTime;
            dataGeo.softTime = adresses[x].softTime;
            
            dataGeo.properties = response.features[i].properties
            dataGeo.lat = response.features[i].geometry.coordinates[1].toString();
            dataGeo.long = response.features[i].geometry.coordinates[0].toString();
            dataGeo.rang = (i + 1).toString();
            this.AdressesService.addAdresseGeo(dataGeo);
            nb_max += 1;
          } catch (error) {
            continue;
          }
        }
    })
      
    } 

    await this.sleep(1000);
    this.AdressesService.getAdresseGeo().subscribe( res => this.nb = res.length)
    while ( this.nb < nb_max){
      this.AdressesService.getAdresseGeo().subscribe( res => this.nb = res.length)
      await this.sleep(500);
    }
    this.display_button_exp=true;
    this.geocodage_done=true;
    this.chargement=false;
    
  }
}
