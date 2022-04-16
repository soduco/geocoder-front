import { Injectable } from '@angular/core';
import { CsvData } from './csv/csv.component';

@Injectable({
  providedIn: 'root'
})
export class CsvServiceService {

  data: Array<string>[] = [];
  header: string[] = [];
  preparedDate: Array<CsvData> = [];

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

  setPreparedCSV(data: Array<CsvData>) {
    this.preparedDate = data;
  }

  getPreparedCSV() {
    return this.preparedDate;
  }

}
