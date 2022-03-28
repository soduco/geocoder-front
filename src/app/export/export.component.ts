import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ApiService } from '../api.service';
import { AdressesService} from '../adresses.service';
import { CsvDataGeo } from '../csv/csv.component';
import { response } from 'express';

@Component({
  selector: 'app-export',
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.css']
})

export class ExportComponent implements OnInit{

  constructor(private AdressesService:AdressesService, public apiService: ApiService,) { }
  data! : CsvDataGeo[];
  headers = [
    'text',
    'startingTime',
    'endingTime',
    'softTime',
    'lat',
    'long',
    'rang'
  ]
  ngOnInit(): void {
    this.AdressesService.getAdresseGeo().subscribe(response => {
      this.data = response
    })
  }
  
  options = {
    
    filename : "results.csv",
    fieldSeparator: ';',
    quoteStrings: '"',
    decimalseparator: '.',
    showLabels: true,
    headers: this.headers,
    showTitle: false,
    title: '',
    useBom: false,
    removeNewLines: true,
    keys: this.headers
  };

  ConvertToCSV( ) {
    var adressesGeo = this.AdressesService.getAdresseGeo()
    console.log(adressesGeo)
    
    const Papa = require("papaparse");
    
    const features=[];
    var csv_data = Papa.unparse(adressesGeo);
    console.log(csv_data);

    var fs = require('browserify-fs');
 
    fs.writeFile('./export.csv', csv_data, function() {
      fs.readFile('./export.csv', 'utf-8', function(_err: any, data: any) {
        console.log(data);
      });
    });
  }

}
