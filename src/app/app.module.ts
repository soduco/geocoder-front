import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MapComponent } from './map/map.component';

import { CsvComponent } from './csv/csv.component';
import { GeocodeurComponent } from './geocodeur/geocodeur.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Dialog, ExportComponent } from './export/export.component';

import { Angular2CsvModule } from 'angular2-csv';
import { CommonModule } from "@angular/common";
import { FormsModule } from '@angular/forms';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter';
import {DateAdapter, MatRippleModule, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import { AppMaterialModule } from "./app.material-module";
import {DataTablesModule} from 'angular-datatables';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {MatSliderModule} from '@angular/material/slider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule} from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { NO_ERRORS_SCHEMA } from '@angular/compiler';
import { ErrorIntercept } from './error.interceptor';
import { ReactiveFormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatRadioModule} from '@angular/material/radio';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { KoiExpandButtonComponent } from './koi-expand-button/koi-expand-button.component';
@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    CsvComponent,
    GeocodeurComponent,
    ExportComponent,
    Dialog,
    KoiExpandButtonComponent
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
    MatButtonToggleModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatSliderModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatToolbarModule,
    MatButtonModule,
    MatRadioModule,
    MatFormFieldModule,
    MatInputModule,
    MatRippleModule,
    MatDialogModule,
    MatSlideToggleModule


  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: ErrorIntercept, multi: true }
  ],
  bootstrap: [AppComponent],
  schemas: [  ]
})
export class AppModule { }
