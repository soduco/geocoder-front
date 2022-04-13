import { Component, Inject, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ApiService } from '../api.service';
import { AdressesService} from '../adresses.service';
import { CsvServiceService } from '../csv-service.service';

import { CsvDataGeo } from '../csv/csv.component';
import {MatDialog} from '@angular/material/dialog';

/*
* Component of the button Download. 
*/
@Component({
  selector: 'app-export',
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.css']
})
export class ExportComponent {
  constructor(public dialog: MatDialog) { }
  openDialog() {
    const dialogRef = this.dialog.open(Dialog,{width:'500px'});
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
}

/*
* Component of the dialog box where the user can choose the format of the download data. 
*/
@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.html',
}) 
export class Dialog{

  constructor(private AdressesService:AdressesService, public apiService: ApiService,public CsvService : CsvServiceService) { }

  data : any =[];
  headers = ['text','startingTime','endingTime','softTime','lat','long','rang','properties']
  final_headers: string[] = [];
  format:any = null;
  nombre_export: number = 0;

  
  /**
   * Function to change the current format of the download option.
   * @param  {any} value : format (csv or json)
   */
  choix_format(value:any){
    this.format = value
  }
  
  /**
   * Function used to return a list of CSVDataGeo : the geolocalised data. 
   * @param  {number} number : 0 if we want to download all data, 1 if we want to download only first results
   * @return {CsvDataGeo[]} : list of the data to export 
   */
  getAdressesCSV(number:number) : CsvDataGeo[]{
    const file_headers = this.CsvService.getHeader()
    this.final_headers=[]
    let data : CsvDataGeo[]=[];

    //Construction of the headers
    for (let i=0 ; i<file_headers.length ; i++){
      this.final_headers.push(file_headers[i])
    }
    for (let i=0;i<this.headers.length;i++){
      this.final_headers.push(this.headers[i])
    }
   //Construction of the lines of data according to the previous headers
    this.AdressesService.getAdresseGeoByRang(number).subscribe(response => {
      for (let i=0;i<response.length;i++){
      
        let ligne : any = {}
        for (let k=0;k< response[i].row_data.length ; k++){
          ligne[file_headers[k]] = response[i].row_data[k]
        }

        for (const [key, value] of Object.entries(response[i])) {
          if (`${key}` == 'row_data'){continue}
          if (`${key}` == 'properties'){ ligne[`${key}`] = JSON.stringify(value);continue }
          ligne[`${key}`] = `${value}`
        }
        data.push(ligne)
      }
    })
    return data
  }

  /**
   * Function used to return a list of CSVDataGeo : the geolocalised data. 
   * @param  {number} number : 0 if we want to download all data, 1 if we want to download only first results
   * @return {CsvDataGeo[]} : list of the data to export 
   */
  getAdressesJSON(number:number) {
    this.AdressesService.getAdresseGeoByRang(number).subscribe(response => {
      return response;
    })
  } 

  /**
   * Convert the array of the data to an exportable csv format.
   * @param  {any} objArray :list of the data
   */
  convertToCSV(objArray : any) {
    var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    var str = '';
    for (let head of this.final_headers){
      str+=head +';'
    }
    str += '\r\n';
    for (let i = 0; i < array.length; i++) {
        let line = '';
        for (let head of this.final_headers) {
            if (line != '') line += ';'
            line += array[i][head];
        }
        str += line + '\r\n';
    }
    return str;
  }
  
  /**
   * Bring in the component the information about the number of export. 
   * @param  {any} event : 
   */
  choix_nombre(event : any){
    this.nombre_export = +event
  }
  /**
   * Function used when the user click on Download. Depending on the format and the nombre_export,
   * differents functions are called. 
   */
  exportCSV(){
    var FileSaver = require('file-saver');
    if (!this.format ){
      alert("Choisir un format ! ")
      return 
    } 
    if (this.format == "csv"){
      let data = this.getAdressesCSV(this.nombre_export)
      let data2 = (this.convertToCSV(data) )
      var blob = new Blob([data2], {type: "csv"});
      FileSaver.saveAs(blob, "resultats_geolocalisés.csv");
      return 
    }
    if (this.format == "json"){
      let theJSON = JSON.stringify(this.getAdressesJSON(this.nombre_export))
      let blob = new Blob([theJSON], { type: 'json' });
      FileSaver.saveAs(blob, "resultats_geolocalisés.json");
      return
    }
  }

}

