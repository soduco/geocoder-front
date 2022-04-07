import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ApiService } from '../api.service';
import { AdressesService} from '../adresses.service';
import { CsvServiceService } from '../csv-service.service';

import { CsvDataGeo } from '../csv/csv.component';
import { response } from 'express';

@Component({
  selector: 'app-export',
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.css']
})

export class ExportComponent implements OnInit{


  constructor(private AdressesService:AdressesService, public apiService: ApiService,public CsvService : CsvServiceService) { }

  data : any =[];
  headers = ['text','startingTime','endingTime','softTime','lat','long','rang','properties']
  final_headers: string[] = [];

  ngOnInit(): void {
  }

  getAdressesCSV() : any{
    const file_headers = this.CsvService.getHeader()
    this.final_headers=[]
    let data : CsvDataGeo[]=[];

    for (let i=0 ; i<file_headers.length ; i++){
      this.final_headers.push(file_headers[i])
    }
    for (let i=0;i<this.headers.length;i++){
      this.final_headers.push(this.headers[i])
    }
   
    this.AdressesService.getAdresseGeo().subscribe(response => {
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

  


  convertToCSV(objArray : any) {
    var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    console.log(array)
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


exportCSV(){
  var FileSaver = require('file-saver');
  let data = this.getAdressesCSV()
  let data2 = (this.convertToCSV(data) )
  var blob = new Blob([data2], {type: "csv"});
  FileSaver.saveAs(blob, "csv-test.csv");
}


// options = {
//   filename : "results.csv",
//   fieldSeparator: ';',
//   quoteStrings: '"',
//   decimalseparator: '.',
//   showLabels: true,
//   headers: this.final_headers,
//   showTitle: false,
//   title: '',
//   useBom: false,
//   removeNewLines: true,
//   keys: this.final_headers
// };

  // ConvertToCSV( ) {
  //   var adressesGeo = this.AdressesService.getAdresseGeo()
  //   console.log(adressesGeo)
    
  //   const Papa = require("papaparse");
    
  //   const features=[];
  //   var csv_data = Papa.unparse(adressesGeo);
  //   console.log(csv_data);

  //   var fs = require('browserify-fs');
 
  //   fs.writeFile('./export.csv', csv_data, function() {
  //     fs.readFile('./export.csv', 'utf-8', function(_err: any, data: any) {
  //       console.log(data);
  //     });
  //   });
  // }
}
