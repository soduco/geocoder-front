import { AdressesService } from './adresses.service';
import { NgModule } from '@angular/core';
import { AdressesComponent } from './adresses.component'
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AdressComponent } from './adress/adress.component';
import { MapComponent } from './map/map.component';

import { CsvComponent } from './csv/csv.component';
import { GeocodeurComponent } from './geocodeur/geocodeur.component';
import { HttpClientModule } from '@angular/common/http';
import { ExportComponent } from './export/export.component';

import { Angular2CsvModule } from 'angular2-csv';
import { CommonModule } from "@angular/common";
import { FormsModule } from '@angular/forms';
import {MatProgressBarModule} from '@angular/material/progress-bar';

import { AppMaterialModule } from "./app.material-module";
import {DataTablesModule} from 'angular-datatables';


@NgModule({
  declarations: [
    AppComponent,
    AdressesComponent,
    AdressComponent,
    MapComponent,
    CsvComponent,
    GeocodeurComponent,
    ExportComponent,
    
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    Angular2CsvModule,
    CommonModule,
    FormsModule,
    MatProgressBarModule,
    AppMaterialModule,
    DataTablesModule,
  ],
  providers: [
    AdressesService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
