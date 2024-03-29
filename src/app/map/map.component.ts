import { ApiService } from './../api.service';
import { Component, AfterViewInit, Input, OnChanges, SimpleChanges, NgModule, OnDestroy, Inject, OnInit, ViewChild, EventEmitter, Output, HostListener } from '@angular/core';
import * as L from 'leaflet'
import { environment } from 'src/environments/environment.prod';
import { HttpClient } from '@angular/common/http';
import { AdressesService } from '../adresses.service';
import { CsvDataGeo } from '../csv/csv.component';

import {Subject} from 'rxjs';
import { CsvServiceService } from '../csv-service.service';
import { DataTableDirective } from 'angular-datatables';
import { data } from 'jquery';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})

// https://blog.logrocket.com/angular-datatables-feature-rich-tables/

export class MapComponent implements  OnChanges, OnDestroy,OnInit{
  @ViewChild(DataTableDirective, {static: false})
  dtElement!: DataTableDirective;

  public map_class='droite'
  public tab_class = 'gauche'
  public innerWidth!:number
 
  public container = 'invisible_container'

  readonly ROOT_URL = "http://dev-geocode.geohistoricaldata.org/v1/search?";
  posts:any;
  adresses = new Array<any>();
  @Input() public data_available: any; 
  @Output() public enfant = new EventEmitter<boolean>();
  private http: HttpClient | undefined ;

  //boolean for activation of button and displays of the tables 
  display_button_geo: boolean = true;
  display_table_geo : boolean = false;
  display_table_geo_details : boolean = false;
  display_map : boolean = false;
  //databases for the 2 possible table 
  public databaseGeo : CsvDataGeo[] = [];
  public databaseGeoDetails : CsvDataGeo[] = [];
  //simple headers --> TO BE CHANGE
  public headers: string[] =[];
  //components used to display datatables 
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  //Leaflet components 
  map: any; 
  selected_marker:any;
  markers:any = [];
  modernLayer = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: environment.mapbox.accessToken
  });

  // Différents fonds de carte disponibles
  poubelle_1888 = L.tileLayer.wms('http://geohistoricaldata.org/geoserver/wms', {
  layers: "paris-rasters:poubelle_1888"
  });
  verniquet_1789 = L.tileLayer.wms('http://geohistoricaldata.org/geoserver/wms', {
  layers: "paris-rasters:verniquet_1789_demo_11_avril"
  });
  jacoubet_1836 =L.tileLayer.wms('http://geohistoricaldata.org/geoserver/wms', {
  layers: "paris-rasters:jacoubet_1836"
  });
  andriveau_1849 = L.tileLayer.wms('http://geohistoricaldata.org/geoserver/wms', {
  layers: "paris-rasters:andriveau_1849"
  });
  picquet_1809 = L.tileLayer.wms('http://geohistoricaldata.org/geoserver/wms', {
  layers: "paris-rasters:picquet_1809"
  });
  BHDV_1888 = L.tileLayer.wms('http://geohistoricaldata.org/geoserver/wms', { // Meilleure qualité que poubelle_1888
  layers: "paris-rasters:BHdV_PL_ATL20Ardt_1888"
  });

  
  //To get services 
  constructor(public apiService: ApiService, private adresseService : AdressesService,public csvService : CsvServiceService) { }


  /**
   * Function to update the css of map and table. In order to display the 2 entities next to each other or one after the other 
   * depending on the size of the window. 
   */
  maj_css_map(){
    if( this.innerWidth <1300){
      this.map_class='bas'
      this.tab_class='haut'
    }
    else{
      this.map_class='droite'
      this.tab_class='gauche'
    }
  }
  
  @HostListener('window:resize', ['$event']) onResize() { 
    this.innerWidth = window.innerWidth
    this.maj_css_map()
  }
  
  /**
   * Bring in the component the value of the size of the window. 
   * @returns void
   */
  ngOnInit(): void {
    this.innerWidth = window.innerWidth
    this.maj_css_map()
  }

  /** 
   * Function to create and display a map in the web interface 
   */
  createMap() {
    
    const paris_centre = {
      lat: 48.86651,
      lon: 2.34963
    };

    const zoomLevel = 12;

    // La carte est censée être comme ci-dessous avec crs : ESPG:4326 pour WMS84 mais cela crée des problèmes de projection avec MAPBOX
    // this.map = L.map('map', {crs: L.CRS.EPSG4326})
    // .setView([paris_centre.lat, paris_centre.lon], zoomLevel);

    this.map = L.map('map',{layers: [this.modernLayer, this.BHDV_1888, this.andriveau_1849, this.jacoubet_1836, this.picquet_1809,  this.verniquet_1789]}).setView([paris_centre.lat, paris_centre.lon], zoomLevel);

    var baseMaps = {
      "Moderne": this.modernLayer,
      "1888": this.BHDV_1888,
      "1849": this.andriveau_1849,
      "1836": this.jacoubet_1836,
      "1809": this.picquet_1809,
      "1789": this.verniquet_1789
    };

    var layerControl = L.control.layers(baseMaps);
    // layerControl
    layerControl.addTo(this.map);
  };

 
  /**
   * Fonction activated whenever a change is registred in geocodeur component -> display the button "Previsualisation des resultats"
   * @param  {SimpleChanges} changes 
   */
  ngOnChanges(changes: SimpleChanges) {
   
    if (changes['data_available'].currentValue == true){
      
      this.display_button_geo=false
      this.display_map=true;
      this.graphic_display() 
    }
    else{
      
      this.display_table_geo = false;
      this.display_table_geo_details=false;
      this.display_map=false;
      if(typeof(this.map) != 'undefined'){
        this.map.off()
        this.map.remove()
      }
    }
  }

  rounded(nombre:number){
    return Math.round(nombre)
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
    

    this.container='background_container'
    const droite = document.getElementById( 'droite' );
    if(droite){
      droite.scrollIntoView(); // On scroll vers le bas de la page
    }
    this.enfant.emit(this.display_table_geo);
    this.dtOptions={
      pagingType: 'full_numbers',
      pageLength: 5,
      processing: true,
      order:[],
   
    };

    this.headers=this.csvService.getHeader()
    this.adresseService.getAdresseGeoByRang(1).subscribe((response:any) => {
      this.databaseGeo = response;
    })

    this.display_table_geo = true;
    try {
      this.createMap();
      let legend = new L.Control({ position: "topright"});

      legend.onAdd = function() {
      var div = L.DomUtil.create("div", "legend");
      div.innerHTML += "<h4>Résultats</h4>";
      div.innerHTML += '<i style="background: #3333FF"></i><span>Principal</span><br>';
      div.innerHTML += '<i style="background: #ff7800"></i><span>Secondaires</span><br>';
      return div;
    };

    legend.addTo(this.map);
    } catch (error) {
      console.log(error)
    }
  }
  
  /**
   * Function when the button "retour" is pressed -> display normal datable / remove datable details  
   */
  retour(){
    window.scrollTo(0,document.body.scrollHeight);
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
    window.scrollTo(0,document.body.scrollHeight);
   
    this.cleanMap() // clean the map of all markers 
    this.adresseService.getAdresseGeoByAdresse(data.text,data.startingTime,data.endingTime).subscribe((response:any) => {
      this.databaseGeoDetails = response 
    })
    var MarkerOptions = {radius: 8,fillColor: "#ff7800",color: "#000",weight: 1,opacity: 0.8,fillOpacity: 0.8};
    var MarkerOptions2 = {radius: 8,fillColor: "#3333FF",color: "blue",weight: 1,opacity: 0.8,fillOpacity: 0.8}

    for (let data of this.databaseGeoDetails){

      var numberIcon = L.divIcon({className: 'test',html : data.rang,iconAnchor:[3.5,8]});
      if (data.rang == 1 ) {
        var circle = L.circleMarker([data.lat,data.long], MarkerOptions2);
      }
      else{
        var circle = L.circleMarker([data.lat,data.long], MarkerOptions);
      }
      circle.addTo(this.map).bindPopup(data.properties.name);
      var marker_number = L.marker([data.lat, data.long],{icon: numberIcon})
      marker_number.addTo(this.map).bindPopup(data.properties.name)

      this.markers.push(circle,marker_number)
     
    }
    this.map.fitBounds(L.featureGroup(this.markers).getBounds(),{ padding: [20, 20] });
    
    this.display_table_geo = false;
    this.display_table_geo_details=true;

  }
 
  /**
   * Function activated when the button "mettre au rang 1" is pressed. 
   * Put the current data in rank 1 and the old data rank 1 to the currant data rank. 
   * @param  {any} data : data selected 
   */
  rang(data : any ){
    console.log(data)
    const rang_click = data.rang 
    this.adresseService.changeAdresseRang(data.text,data.startingTime,data.endingTime,"1","-1")
    this.adresseService.changeAdresseRang(data.text,data.startingTime,data.endingTime,rang_click,"1")
    this.adresseService.changeAdresseRang(data.text,data.startingTime,data.endingTime,"-1",rang_click)
    this.display_table_geo_details=false;
    this.display_table_geo_details=true;
    this.cleanMap()
    this.details(data)
   
  }


  /**
   * Function activated when the mouse passed over the details datatable.
   * @param  {any} data : data selected 
   */
  over_details(data : any){
    var MarkerOptions = {radius: 12,fillcolor:"yellow",color: "yellow",weight: 1,opacity: 1,fillOpacity: 1};
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
    var meanDate = Math.round((Number(data.startingTime) + Number(data.endingTime))/2); // Moyenne de la date pour la requête. Cette date permet de choisir le fond de carte le plus adapté 

    if(meanDate<1800){this.resetZindex();this.verniquet_1789.setZIndex(7);
    } else if(meanDate<1822){this.resetZindex();this.picquet_1809.setZIndex(7);
    } else if(meanDate<1844){this.resetZindex();this.jacoubet_1836.setZIndex(7);
    } else if(meanDate<1869){this.resetZindex();this.andriveau_1849.setZIndex(7);
    } else {this.resetZindex();this.BHDV_1888.setZIndex(7);
    }

    var MarkerOptions = {radius: 8,fillColor: "#ff7800",color: "#000",weight: 1,opacity: 1,fillOpacity: 0.8};
    var MarkerOptions2 = {radius: 8,fillColor: "#3333FF",color: "#000",weight: 1,opacity: 1,fillOpacity: 0.8}

    this.adresseService.getAdresseGeoByAdresse(data.text,data.startingTime,data.endingTime).subscribe((response:any) => {
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

    let group = L.featureGroup(this.markers)
    this.map.fitBounds(group.getBounds(),{padding:[100,100]} )

    group.clearLayers()
    
  }

  /**
   * Function activated whent the mouse passed out the datatable.
   */
  out(){
    this.cleanMap();
    this.resetZindex(); // On remet le fond moderne en premier plan. A voir si c'est pertinent ou pas
  }

  /**
   * Function used to clean the map from markers.
   */
  cleanMap(){
    for ( let marker of this.markers){
      this.map.removeLayer(marker)
    }
    this.markers=[]
  }


  sleep(ms : number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  resetZindex(){
    this.verniquet_1789.setZIndex(5);
    this.picquet_1809.setZIndex(5);
    this.jacoubet_1836.setZIndex(5);
    this.andriveau_1849.setZIndex(5);
    this.BHDV_1888.setZIndex(5);
  }

}




