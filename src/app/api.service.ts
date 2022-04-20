import { CsvData } from './csv/csv.component';
import { Injectable } from '@angular/core';

import { Observable, throwError } from 'rxjs';

import { HttpClient, HttpErrorResponse, HttpParams, HttpHeaders } from '@angular/common/http';
import { retry, catchError } from 'rxjs/operators';
import { CsvServiceService } from './csv-service.service';
import { TransformCsvService } from './transform-csv.service';


@Injectable({
  providedIn: 'root'
})
export class ApiService {
  public errorMessage: any;

  constructor(private http: HttpClient, private csvService: CsvServiceService, private transformCSV : TransformCsvService ) { }

  public getAdress(adress: string, startingTime: number, endingTime: number, softTime: number,size :number ): Observable<any> {
    const url = "http://dev-geocode.geohistoricaldata.org/api/v1/search?";
    let queryParams = new HttpParams();
    queryParams = queryParams.append("size",size);
    queryParams = queryParams.append("text",adress);
    queryParams = queryParams.append("time.window.start",startingTime);
    queryParams = queryParams.append("time.window.end",endingTime);
    queryParams = queryParams.append("time.softness",softTime);

    const response =  this.http.get(url,{params:queryParams})
                     .pipe(retry(1),catchError(this.handleError));

    return response;
  }

  public getAdressMass(softTime:number, size:number): Observable<any>{ // il faut formatter le csv avant de le mettre en argument de cette fonction !
    const url = "http://dev-geocode.geohistoricaldata.org/api/v1/msearch?";
    let queryParams = new HttpParams();
    queryParams = queryParams.append("size",size);
    queryParams = queryParams.append("time.softness",softTime);
    queryParams = queryParams.append("text",1);

    // let preparedCSV = this.csvService.getPreparedCSV();
    // let csv = this.transformCSV.convertToCSV(preparedCSV);
    console.log(queryParams);

    let headers = this.csvService.getHeader();
    let csv = this.csvService.getCsvData();
    let goodCSV = [];
    goodCSV[0] = headers;
    for(let i=1; i<csv.length+1; i++){
      goodCSV[i] = csv[i-1];
    }
    // console.log(goodCSV);
    let httpheader = new HttpHeaders();
    // httpheader = httpheader.append('Content-Type', 'text/csv');


    const response = this.http.post(url,goodCSV,{params:queryParams})
                      .pipe(retry(1),catchError(this.handleError));

    return response;
  }

  // HTTP Interceptor 
  
  handleError(error: HttpErrorResponse) {
    return (error.message || 'server Error');
  }

  /**
   * Fonction pour mieux gèrer les erreurs mais fonctionne pas. Y'a du potentiel mais manque de temps
   * 
   * @param adress : adress to geocode
   * @param startingTime : starting time of the geocoding
   * @param endingTime : ending time of the geocoding 
   * @param softTime : softness of the geocoding
   * @param size : number of results
   */
  // public getAdressBIS(adress: string, startingTime: number, endingTime: number, softTime: number,size :number ) {
  //   const url = "http://dev-geocode.geohistoricaldata.org/api/v1/search?";
  //   let queryParams = new HttpParams();
  //   queryParams = queryParams.append("size",size);
  //   queryParams = queryParams.append("text",adress);
  //   queryParams = queryParams.append("time.window.start",startingTime);
  //   queryParams = queryParams.append("time.window.end",endingTime);
  //   queryParams = queryParams.append("time.softness",softTime);

  //   let response!:Observable<any>;
    
  //   this.http.get<any>(url,{params:queryParams}).subscribe({
  //     next: data => {
  //       response = data;
  //     },
  //     error: error => {
  //       this.errorMessage = error.message;
  //       console.error('There was an error!', error);
  //       console.log(error.message);
  //     }
  //   });

  //   setTimeout(() => {return response;}, 2000);
  // }
}
