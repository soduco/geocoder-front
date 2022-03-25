import { ApiService } from './../api.service';
import { Component, AfterViewInit, Input, OnChanges, SimpleChanges, NgModule } from '@angular/core';
import * as L from 'leaflet'
import { environment } from 'src/environments/environment.prod';
import { HttpClient } from '@angular/common/http';
import { AdressesService } from '../adresses.service';
import { CommonModule } from "@angular/common";

// import { getHeapCodeStatistics } from 'v8';


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})



export class MapComponent implements AfterViewInit, OnChanges {

  map: any; 
  readonly ROOT_URL = "http://dev-geocode.geohistoricaldata.org/v1/search?";
  posts:any;
  adresses = new Array<any>();
  @Input() public data_available: any; 
  display_button_geo: boolean = true;


  private http: HttpClient | undefined ;
  
  constructor(public apiService: ApiService, private adresseService : AdressesService) { }

  createMap() {
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

  ngAfterViewInit(): void {
    this.createMap();
  };

  ngOnInit() {   
  }

  ngOnChanges(changes: SimpleChanges) {

    if (changes['data_available'].currentValue == true){
      this.display_button_geo=false
    }
  }
      
  graphic_display(){

    var MarkerOptions = {
      radius: 8,
      fillColor: "#ff7800",
      color: "#000",
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8
  };

    this.adresseService.getAdresseGeo().subscribe(response => {
      const adressesGeo = response 
      for (var ad of adressesGeo){
        var circle = L.circleMarker([ad.lat,ad.long], MarkerOptions);
        circle.addTo(this.map).bindPopup(ad.text);
      }
    })
    
  }
}


