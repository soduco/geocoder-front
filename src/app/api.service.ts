import { CsvData } from './csv/csv.component';
import { Injectable } from '@angular/core';


import { Observable, throwError } from 'rxjs';

import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { retry, catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class ApiService {
  public errorMessage: any;

  constructor(private http: HttpClient) { }

  public getAdress(adress: string, startingTime: number, endingTime: number, softTime: number,size :number ): Observable<any> {
    const url = "http://dev-geocode.geohistoricaldata.org/api/v1/search?";
    let queryParams = new HttpParams();
    queryParams = queryParams.append("size",size);
    queryParams = queryParams.append("text",adress);
    queryParams = queryParams.append("time.window.start",startingTime);
    queryParams = queryParams.append("time.window.end",endingTime);
    queryParams = queryParams.append("time.softness",softTime);

//     return this.http.get<any>(url,{params:queryParams}).pipe(
//       catchError((err) => {
//         console.log('error caught in service')
//         console.error(err);

//         //Handle the error here

//         return throwError(err);    //Rethrow it back to component
//       }) ) 
// 
    const response =  this.http.get(url,{params:queryParams})
                     .pipe(retry(1),catchError(this.handleError));

    return response;
  }

  public getAdressMass(softTime:number, size:number, body:CsvData): Observable<any>{ // il faut formatter le csv avant de le mettre en argument de cette fonction
    const url = "http://dev-geocode.geohistoricaldata.org/api/v1/msearch?";
    let queryParams = new HttpParams();
    queryParams = queryParams.append("size",size);
    queryParams = queryParams.append("time.softness",softTime);

    let response!:Observable<any>;

    this.http.post<any>(url,body,{params:queryParams}).subscribe({
      next: data => {
        response = data;
      },
      error: error => {
          this.errorMessage = error.message;
          console.error('There was an error!', error);
      }
    })

    return response;

  }

  // HTTP Interceptor 
  
  handleError(error: HttpErrorResponse) {
    return throwError(error.message || 'server Error');

  }
}
