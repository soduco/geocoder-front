import { Injectable } from '@angular/core';
import { CsvServiceService } from './csv-service.service';

@Injectable({
  providedIn: 'root'
})
export class TransformCsvService {
  public final_headers: string[] = [];
  public headers = ['text','startingTime','endingTime','softTime','lat','long','rang','source','precision','properties']

  public CSV: object | undefined;

  constructor( public CsvService : CsvServiceService) { }

  /**
   * Convert the array of the data to a csv.
   * @param  {any} objArray :list of the data
   */
  convertToCSV(objArray : any) {

    const file_headers = this.CsvService.getHeader()
    this.final_headers=[]
    //Construction of the headers
    for (let i=0 ; i<file_headers.length ; i++){
      this.final_headers.push(file_headers[i])
    }
    for (let i=0;i<this.headers.length;i++){
      this.final_headers.push(this.headers[i])
    }

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
    var blob = new Blob([str], {type: "csv;charset=UTF-8"});
    return blob;
  }

  setConvertedCsv( csv : object){
    this.CSV = csv;
  }
  
  getConvertedCsv(){
    return this.CSV;
  }
}
