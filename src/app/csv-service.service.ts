import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { CsvData, CsvDataGeo } from './csv/csv.component';

@Injectable({
  providedIn: 'root'
})
export class CsvServiceService {

  data: Array<string>[] = [];
  header: string[] = [];

  constructor() { }

  setCsvData(data: Array<string>[]) {
    this.data = data;
  }

  getCsvData() {
    return this.data;
  }

  getCsvDataById(id:number ){
    return this.data[id];
  }
  setHeader(header: string[]) {
    this.header = header;
  }

  getHeader() {
    return this.header;
  }

  cleanCsvData(){
    this.data = [];
    this.header = [];
  }
}
