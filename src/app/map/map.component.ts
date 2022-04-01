import { ApiService } from './../api.service';
import { Component, AfterViewInit, Input, OnChanges, SimpleChanges, NgModule, OnDestroy, Inject, OnInit } from '@angular/core';
import * as L from 'leaflet'
import { environment } from 'src/environments/environment.prod';
import { HttpClient } from '@angular/common/http';
import { AdressesService } from '../adresses.service';
import { CsvDataGeo } from '../csv/csv.component';

import {Subject} from 'rxjs';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})

// https://blog.logrocket.com/angular-datatables-feature-rich-tables/

export class MapComponent implements  OnChanges, OnDestroy{

  
  readonly ROOT_URL = "http://dev-geocode.geohistoricaldata.org/v1/search?";
  posts:any;
  adresses = new Array<any>();
  @Input() public data_available: any; 
  private http: HttpClient | undefined ;

  //boolean for activation of button and displays of the tables 
  display_button_geo: boolean = true;
  display_table_geo : boolean = false;
  display_table_geo_details : boolean = false;

  //databases for the 2 possible table 
  public databaseGeo : CsvDataGeo[] = [];
  public databaseGeoDetails : CsvDataGeo[] = [];
  //simple headers --> TO BE CHANGE
  public headers = ['text','startingTime','endingTime','softTime'];
  //components used to display datatables 
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  //Leaflet components 
  map: any; 
  selected_marker:any;
  markers:any = [];

  //To get services 
  constructor(public apiService: ApiService, private adresseService : AdressesService) { }


 
  /** 
   * Function to create and display a map in the web interface 
   */
  createMap() {
    console.log("on créer la map")
    const paris_centre = {
      lat: 48.86651,
      lon: 2.34963
    };

    const zoomLevel = 12;
    this.map = L.map('map').setView([paris_centre.lat, paris_centre.lon], zoomLevel);

    const mainLayer = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: 'mapbox/streets-v11',
      tileSize: 512,
      zoomOffset: -1,
      accessToken: environment.mapbox.accessToken,
    });

    mainLayer.addTo(this.map);
  };

  
  /**
   * Fonction activated whenever a change is registred in geocodeur component -> display the button "Previsualisation des resultats"
   * @param  {SimpleChanges} changes 
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes['data_available'].currentValue == true){
      this.display_button_geo=false
    }
  }
  
  
  /**
   * Function to unsubscribe the datatable
   */
  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  
  /**
   * Function used when the button "Prévisualisation des résultats" is pressed. 
   * Create the databse for the datatable and create the map.
   */
  graphic_display(){
    this.adresseService.getAdresseGeoByRang(1).subscribe((response:any) => {
      this.databaseGeo = response;
      this.dtOptions={
        pagingType: 'full_numbers',
        pageLength: 5,
        processing: true,
        order:[],
      };
    })
    this.display_table_geo = true;
    this.createMap();
  }
  
  /**
   * Function when the button "retour" is pressed -> display normal datable / remove datable details  
   */
  retour(){
    this.display_table_geo = true;
    this.display_table_geo_details=false;
    this.cleanMap()
  }

  /**
   * Function to zoom the map in the zoom number you want. 
   * @param  {any} data : csvataGeo -> one line of result 
   * @param  {number} zoom : zoom you want the map to be 
   */
  zoom(data : any,zoom : number){
    this.map.setView([data.lat, data.long], zoom);
  }

  
  /**
   * Function use to bring the details of one adresse and display it in the details datatable.
   * @param  {any} data : data selected 
   */
  details(data : any){
    this.cleanMap()
    var MarkerOptions = {radius: 8,fillColor: "#ff7800",color: "#000",weight: 1,opacity: 1,fillOpacity: 0.8};
    this.adresseService.getAdresseGeoByAdresse(data.text).subscribe((response:any) => {
      this.databaseGeoDetails = response 
    })

    for (let data of this.databaseGeoDetails){
      var circle = L.circleMarker([data.lat,data.long], MarkerOptions);
      this.markers.push(circle)
      circle.addTo(this.map).bindPopup(data.text);
    }

    this.display_table_geo = false;
    this.display_table_geo_details=true;

  }

  
  /**
   * Function activated when the button "mettre au rang 1" is pressed. 
   * Put the current data in rank 1 and the old data rank 1 to the currant data rank. 
   * @param  {any} data : data selected 
   */
  rang(data : any ){
    const rang_click = data.rang 
    this.adresseService.changeAdresseRang(data.text,"1","-1")
    this.adresseService.changeAdresseRang(data.text,rang_click,"1")
    this.adresseService.changeAdresseRang(data.text,"-1",rang_click)
    this.display_table_geo_details=false;
    this.display_table_geo_details=true;
  }


  /**
   * Function activated when the mouse passed over the details datatable.
   * @param  {any} data : data selected 
   */
  over_details(data : any){
    var MarkerOptions = {radius: 8,fillColor: "blue",color: "blue",weight: 1,opacity: 1,fillOpacity: 0.8}
    this.selected_marker = L.circleMarker([data.lat,data.long], MarkerOptions);
    this.selected_marker.addTo(this.map).bindPopup(data.text);
  }

  /**
   * Function activated whent the mouse passed out the details datatable.
   */
  out_details(){
    this.map.removeLayer(this.selected_marker)
  }

  /**
   * Function activated when the mouse passed over the datatable.
   * @param  {any} data : data selected 
   */
  over(data:any){
    this.zoom(data,12)
    var MarkerOptions = {radius: 8,fillColor: "#ff7800",color: "#000",weight: 1,opacity: 1,fillOpacity: 0.8};
    var MarkerOptions2 = {radius: 8,fillColor: "blue",color: "blue",weight: 1,opacity: 1,fillOpacity: 0.8}

    this.adresseService.getAdresseGeoByAdresse(data.text).subscribe((response:any) => {
      this.databaseGeoDetails = response 
    })
    for (let data of  this.databaseGeoDetails){
      if (data.rang == 1 ) {
        var circle = L.circleMarker([data.lat,data.long], MarkerOptions2);
      }
      else{
        var circle = L.circleMarker([data.lat,data.long], MarkerOptions);
      }
      this.markers.push(circle);
      circle.addTo(this.map);
    }
  }


  /**
   * Function activated whent the mouse passed out the datatable.
   */
  out(){
    this.cleanMap()
  }


  /**
   * Function used to clean the map from markers.
   */
  cleanMap(){
    for ( let marker of this.markers){
      this.map.removeLayer(marker)
    }
  }

}


