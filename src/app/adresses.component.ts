import { Component } from "@angular/core";
import { AdressesService } from "./adresses.service";

@Component({
    selector: 'adresses', // <adresses>
    template: `
    <!--<h2>{{ title }}</h2>-->
    <!--<div class="container-sm">

        <div class="card">
          <div class="card-header">
            Adresses du csv
          </div>

        </div>
      </div>
    <ul>
        <li *ngFor="let adresse of adresses">
            <adress></adress>
        </li>
    </ul>-->
    `
})
export class AdressesComponent{
    /*title = "Adresses du CSV : ";*/


    adresses: any;

    constructor(service : AdressesService){
        this.adresses = service.getAdresse();
    }
}
