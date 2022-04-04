import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError, catchError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  public getAdress(adress: string, startingTime: number, endingTime: number, softTime: number,size :number ): Observable<any> {
    const url = "http://dev-geocode.geohistoricaldata.org/api/v1/search?";
    let queryParams = new HttpParams();
    queryParams = queryParams.append("size",size);
    queryParams = queryParams.append("text",adress);
    queryParams = queryParams.append("time.window.start",startingTime);
    queryParams = queryParams.append("time.window.end",endingTime);
    queryParams = queryParams.append("time.softness",softTime);
    const response =  this.http.get(url,{params:queryParams})
                     .pipe(catchError(this.erroHandler));

    return response;
  }
  
  erroHandler(error: HttpErrorResponse) {
    return throwError(error.message || 'server Error');
  }
}
