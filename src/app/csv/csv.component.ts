import { CurrencyPipe } from '@angular/common';
import { Component, VERSION ,ViewChild } from '@angular/core';
import { cpuUsage } from 'process';
import { AdressesService } from '../adresses.service';


export class CsvData {
    public text: any;
    public startingTime: any;
    public endingTime: any;
    public softTime: any;
}

export class CsvDataGeo {
  public text: any;
  public startingTime: any;
  public endingTime: any;
  public softTime: any;
  public lat:any;
  public long:any;
}



@Component({
  selector: 'csv',
  templateUrl: './csv.component.html',
  styleUrls: [ './csv.component.css' ]
})

export class CsvComponent  {
  name = 'Angular ' + VERSION.major;
  public records: any[] = [];
  public headersRow: any[] = [];
  @ViewChild('csvReader') csvReader: any;
  jsondatadisplay:any;
  public display_button_geo:boolean = false;
  public csv_valid:boolean = false;

  constructor(private adresses_service : AdressesService){
  }

  uploadListener($event: any): void {
    
    let files = $event.srcElement.files;

    if (this.isValidCSVFile(files[0])) {
      this.csv_valid=true;
      this.display_button_geo=true;

      let input = $event.target;
      let reader = new FileReader();
      reader.readAsText(input.files[0]);

      reader.onload = () => {
        let csvData = reader.result;
        if(typeof csvData == "string"){
          let csvRecordsArray = (csvData).split(/\r\n|\n/);
          // console.log(csvRecordsArray);
          this.headersRow = this.getHeaderArray(csvRecordsArray);
          // console.log(this.headersRow);
          if (isValidCSVrows(csvRecordsArray)) {

            this.records = this.getDataRecordsArrayFromCSVFile2(csvRecordsArray, this.headersRow.length);
            // console.log(this.records);
          }else {
            this.display_button_geo=true;
            alert("Please import valid .csv file.");
            this.fileReset();
          }
        }
      };

      const inputCSV = document.getElementById("txtFileUpload");
    //   console.log(inputCSV)
      if(inputCSV){
        // console.log("OK 1/2");
    //     inputCSV.addEventListener("click", function(){console.log('a')});
    //     inputCSV.addEventListener('load', function () {
    //       console.log("OK 2/3")
        const text2 = document.querySelector<HTMLElement>("#two");
        const text3 = document.querySelector<HTMLElement>("#three");

        // console.log(text2);
        if(text2){
          // console.log("OK 2/2");
          text2.style.color = "black";
          text2.style.fontWeight = "bold";
        }
        if(text3){
          // console.log("OK 2/2");
          text3.style.color = "black";
          text3.style.fontWeight = "bold";
        }
      };
      reader.onerror = function () {
        console.log('error is occured while reading file!');
      };

    } else {
      this.display_button_geo=true;
      alert("Please import valid .csv file.");
      this.fileReset();
    }
  }

  getDataRecordsArrayFromCSVFile(csvRecordsArray: any, headerLength: any) {
    let csvArr = [];
    let header
    for (let i = 1; i < csvRecordsArray.length; i++) {
      // console.log((csvRecordsArray[i]).split(';'));
      // console.log((csvRecordsArray[i]).split(','));

      let curruntRecord = (csvRecordsArray[i]).split(';');
      if(curruntRecord.length == 0){
        curruntRecord = (csvRecordsArray[i]).split(',');
      }      
      // console.log(curruntRecord.length);
      // console.log(headerLength);
      if (curruntRecord.length == headerLength) {
        let csvRecord: CsvData = new CsvData();
        csvRecord.text = curruntRecord[0].trim();
        csvRecord.startingTime = curruntRecord[1].trim();
        csvRecord.endingTime = curruntRecord[2].trim();
        csvRecord.softTime = curruntRecord[3].trim();
        csvArr.push(csvRecord);
        this.adresses_service.addAdresse(csvRecord);
      }
    }
    
    return csvArr;
  }

  getDataRecordsArrayFromCSVFile2(csvRecordsArray: any, headerLength: any) {
    let csvArr = []; // Liste des lignes du csv traitée qu'on va renvoyer 

    let headerRaw = csvRecordsArray[0]; // Entête "brut" du fichier CSV

    if(headerRaw.split(',').length > headerRaw.split(';').length){ // On regarde si le csv est séparé par des virgules ou des points-virgules
      
      // Dans ce cas, le header est séparé par des virgules
      
      headerLength = headerRaw.split(',').length;
      for (let i = 1; i < csvRecordsArray.length; i++) { // On parcourt les lignes du csv
        const curruntRecord = (csvRecordsArray[i]).split(',');

        let csvRecord = [];

        if (curruntRecord.length == headerLength) { // On vérifie qu'il y a le bon nombre d'information dans la ligne du csv

          for (let j = 0; j < curruntRecord.length; j++) { // On parcourt les colonnes de la ligne

            if(curruntRecord[j].includes('"')){ // On regarde si les éléments du csv sont entre guillemets ou pas

              // Ici on a un élément entre guillemets

              csvRecord.push(curruntRecord[j].split('"')[1]);
            }else{  
              
              // Ici l'élément n'est pas entre guillemets

              csvRecord.push(curruntRecord[j].trim());
            }
          }
          csvArr.push(csvRecord); // On ajoute la ligne traitée au tableau
          // this.adresses_service.addAdresse(csvRecord);

        }else{ // Ici il n'y a pas le bon nombre d'information dans la ligne du csv
          alert("Le fichier selectionné n'est pas valide : l'entête du fichier ne correspond pas au contenu du fichier. \n \n Une information est manquante ou en trop à la ligne " + (i+1) + ".");
          this.fileReset();
          break;
        }
      }

    }else{

      // Dans ce cas, le header est séparé par des points-virgules

      headerLength = headerRaw.split(';').length;

 
      for (let i = 1; i < csvRecordsArray.length; i++) { // On parcourt les lignes du csv
        const curruntRecord = (csvRecordsArray[i]).split(';');

        let csvRecord = [];

        if (curruntRecord.length == headerLength) { // On vérifie qu'il y a le bon nombre d'information dans la ligne du csv

          for (let j = 0; j < curruntRecord.length; j++) { // On parcourt les colonnes de la ligne

            if(curruntRecord[j].includes('"')){ // On regarde si les éléments du csv sont entre guillemets ou pas

              // Ici on a un élément entre guillemets

              csvRecord.push(curruntRecord[j].split('"')[1]);
            }else{  
              
              // Ici l'élément n'est pas entre guillemets

              csvRecord.push(curruntRecord[j].trim());
            }
          }
          csvArr.push(csvRecord); // On ajoute la ligne traitée au tableau
          // this.adresses_service.addAdresse(csvRecord);

        }else{ // Ici il n'y a pas le bon nombre d'information dans la ligne du csv
          alert("Le fichier selectionné n'est pas valide : l'entête du fichier ne correspond pas au contenu du fichier. \n \n Une information est manquante ou en trop à la ligne " + (i+1) + ".");
          this.fileReset();
          break;
        }
      }
    }
    return csvArr;
  }

//check etension
  isValidCSVFile(file: any) {
    return file.name.endsWith(".csv");
  }

  getHeaderArray(csvRecordsArr: any) {
    let headerArray = []; // Liste contenant les éléments du header qu'on va renvoyer

    if((csvRecordsArr[0]).split(';').length > (csvRecordsArr[0]).split(',').length){ // On regarde si le csv est séparé par des virgules ou des points-virgules

      // Dans ce cas, le header est séparé par des points-virgules

      let headers = (csvRecordsArr[0]).split(';');

      for (let j = 0; j < headers.length; j++) { // On parcourt les éléments du header

        if(headers[j].includes('"')){ // On regarde si les éléments du csv sont entre guillemets ou pas

          // Ici on a un élément entre guillemets

          headerArray.push(headers[j].split('"')[1]);
        }else{  
          
          // Ici l'élément n'est pas entre guillemets

          headerArray.push(headers[j].trim());
        }

      }
      return headerArray; // On renvoie le tableau contenant les éléments traités du header

    } else {

      // Dans ce cas, le header est séparé par des virgules

      let headers = (csvRecordsArr[0]).split(',');

      for (let j = 0; j < headers.length; j++) { // On parcourt les éléments du header

        if(headers[j].includes('"')){ // On regarde si les éléments du csv sont entre guillemets ou pas

          // Ici on a un élément entre guillemets

          headerArray.push(headers[j].split('"')[1]);
        }else{  
          
          // Ici l'élément n'est pas entre guillemets

          headerArray.push(headers[j].trim());
        }

      }
      return headerArray; // On renvoie le tableau contenant les éléments traités du header
    }
  }

  fileReset() {
    this.csvReader.nativeElement.value = "";
    this.records = [];
    this.jsondatadisplay = '';
  }

  getJsonData(){
    this.jsondatadisplay = JSON.stringify(this.records);
  }

  getAdresses(){
    let reader = new FileReader();
    reader.onload = () => {
      let csvData = reader.result;
      if(typeof csvData == "string"){
        let csvRecordsArray = (csvData).split(/\r\n|\n/);

        let headersRow = this.getHeaderArray(csvRecordsArray);

        this.records = this.getDataRecordsArrayFromCSVFile(csvRecordsArray, headersRow.length);

        const adresses = [];
        for(let i=0; i<headersRow.length-1; i++){
          
          adresses.push(this.records[i].text);
        }
        return adresses;
      }
      
    return -1;
    };
  }
}

//Check if the csv is valid
function isValidCSVrows(csvRecordsArray: string[]) {
  let isValidData: boolean = true;
  let headersRow = (csvRecordsArray[0]).split(';');
  // console.log(headersRow);
  let numOfCols = headersRow.length;
  if(numOfCols <= 1){
    headersRow = (csvRecordsArray[0]).split(',');
    numOfCols = (csvRecordsArray[0]).split(',').length;
  }
  // console.log(headersRow);
  // for (let i = 1; i < csvRecordsArray.length-1; i++) {
  //   let row = (csvRecordsArray[i]).split(';');
  //   // console.log(row);
  //   if (row.length !== numOfCols) {
  //     isValidData = false;
  //     break;
  //   }
  // }
  return isValidData;
}