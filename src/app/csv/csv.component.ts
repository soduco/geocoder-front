// Imports
import { CurrencyPipe } from '@angular/common';
import { ParseSpan } from '@angular/compiler';
import { Component, VERSION ,ViewChild } from '@angular/core';
import { cpuUsage } from 'process';
import { AdressesService } from '../adresses.service';
const Papa = require('papaparse');

// Exports
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

// Composent CsvComponent
@Component({
  selector: 'csv',
  templateUrl: './csv.component.html',
  styleUrls: [ './csv.component.css' ]
})

// Class CsvComponent où on définit les méthodes et les attributs de notre composent. Tout le code du component est dans cette classe.
export class CsvComponent  {
  name = 'Angular ' + VERSION.major; // Nom (inutile)

  public records: any[] = []; // Attribut qui va contenir les données du CSV

  public headersRow: any[] = []; // Attribut qui va contenir l'entête du CSV s'il existe

  @ViewChild('csvReader') csvReader: any; // Lecteur du CSV qu'on ré-initialise au besoin (exemple le fichier n'est pas un csv, on ré-initialise le lecteur)

  jsondatadisplay:any; // Attribut qui gère si l'on veut afficher en JSON les données, pas utilisé pour le moment

  public display_button_geo:boolean = false; // Attribut qui gère l'affichage ou non du boutton géocodage

  public csv_valid:boolean = false; // Attribut qui représente la validité ou non du fichier uploadé par l'utilisateur

  constructor(private adresses_service : AdressesService){
  }

  uploadListener($event: any): void { // Méthode principale de la classe où quasiment tout est fait
    
    let files = $event.srcElement.files; // Fichier importé par l'utilisateur


    if (this.isValidCSVFile(files[0])) { // On vérifie que le fichier est valide en utilisant la méthode isValidCSVFile

      // Ici le fichier est valide

      this.csv_valid=true; // On change l'attribut csv_valid car le fichier est valide 

      this.display_button_geo=true; // On affiche le boutton géocodage

      let input = $event.target;
      let reader = new FileReader();
      reader.readAsText(input.files[0]); // Avec ces 3 lignes on lit le fichier importé par l'utilisateur

      reader.onload = () => { // Une fois le fichier chargé on peut le manipuler

        let csvData = reader.result; // CsvData contient les données "brutes" du fichier 

        let resultat: any[] = []; // On crée l'objet resultat qui contient les données traitées. Records deviendra resultat à la fin du traitement

        if(typeof csvData == "string"){ // On vérifie que les données sont bien des chaînes de caractères

          let csvRecordsArray = (csvData).split(/\r\n|\n/); // On sépare les lignes du fichier

          this.headersRow = this.getHeaderArray(csvRecordsArray); // On récupere l'entête du fichier avec la méthode getHeaderArray

          Papa.parse(files[0], { // On utilise papa.parse pour parser le fichier

            download: true,
            header: false, // On indique qu'il n'y a pas de header car on le traite séparement avec la méthode getHeaderArray

            complete: function(results: { data: any[]; }) {
              results.data.map((data, index)=> {
                if(index == 0){
                  return;
                }else{
                  resultat.push(data); // On ajoute les données parsées par papa.parse dans l'objet résultat
                }
              });
            }
          });

          this.records = resultat; // L'objet records prend les données parsées par papa.parse
        }
      };

      const inputCSV = document.getElementById("txtFileUpload"); // On récupère l'objet HTML permettant de charger le fichier

      if(inputCSV){ // On vérifie que l'objet existe

        const text2 = document.querySelector<HTMLElement>("#two"); // On récupère l'objet HTML correspondant au 2.
        const text3 = document.querySelector<HTMLElement>("#three"); // On récupère l'objet HTML correspondant au 3.

        if(text2){ // On vérifie que l'objet existe

          text2.style.color = "black"; // On change la couleur et l'épaisseur du texte 
          text2.style.fontWeight = "bold";
        }
        if(text3){ // On vérifie que l'objet existe

          text3.style.color = "black"; // On change la couleur et l'épaisseur du texte
          text3.style.fontWeight = "bold";
        }
      };
      reader.onerror = function () { // Si le fichier n'est pas valide on affiche un message d'erreur dans la console pour les développeurs :)
        console.log('error is occured while reading file!');
      };

    } else {

      // Ici le fichier est invalide

      alert("Le fichier n'est pas valide. \n \n Veuillez importer un fichier csv (finissant par .csv)."); // On affiche un message d'erreur
      this.fileReset(); // On ré-initialise le lecteur du fichier avec la méthode fileReset
    }
  }


  isValidCSVFile(file: any) { // On vérifie que le fichier importé est bien un fichier csv
    return file.name.endsWith(".csv");
  }

  getHeaderArray(csvRecordsArr: any) { // On récuper l'entête du fichier et on le traite 
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

  fileReset() { // On réinitialise l'import du fichier
    this.csvReader.nativeElement.value = "";
    this.records = [];
    this.jsondatadisplay = '';
  }
}

// ANCIEN CODE POUVANT ETRE UTILE
 // getDataRecordsArrayFromCSVFile(csvRecordsArray: any, headerLength: any) {
  //   let csvArr = [];
  //   let header
  //   for (let i = 1; i < csvRecordsArray.length; i++) {
  //     // console.log((csvRecordsArray[i]).split(';'));
  //     // console.log((csvRecordsArray[i]).split(','));

  //     let curruntRecord = (csvRecordsArray[i]).split(';');
  //     if(curruntRecord.length == 0){
  //       curruntRecord = (csvRecordsArray[i]).split(',');
  //     }      
  //     // console.log(curruntRecord.length);
  //     // console.log(headerLength);
  //     if (curruntRecord.length == headerLength) {
  //       let csvRecord: CsvData = new CsvData();
  //       csvRecord.text = curruntRecord[0].trim();
  //       csvRecord.startingTime = curruntRecord[1].trim();
  //       csvRecord.endingTime = curruntRecord[2].trim();
  //       csvRecord.softTime = curruntRecord[3].trim();
  //       csvArr.push(csvRecord);
  //       this.adresses_service.addAdresse(csvRecord);
  //     }
  //   }
    
  //   return csvArr;
  // }

  // getDataRecordsArrayFromCSVFile2(csvRecordsArray: any, headerLength: any) {
  //   let csvArr = []; // Liste des lignes du csv traitée qu'on va renvoyer 

  //   let headerRaw = csvRecordsArray[0]; // Entête "brut" du fichier CSV

  //   if(headerRaw.split(',').length > headerRaw.split(';').length){ // On regarde si le csv est séparé par des virgules ou des points-virgules
      
  //     // Dans ce cas, le header est séparé par des virgules
      
  //     headerLength = headerRaw.split(',').length;
  //     for (let i = 1; i < csvRecordsArray.length; i++) { // On parcourt les lignes du csv
  //       const curruntRecord = (csvRecordsArray[i]).split(',');

  //       let csvRecord = [];

  //       if (curruntRecord.length == headerLength) { // On vérifie qu'il y a le bon nombre d'information dans la ligne du csv

  //         for (let j = 0; j < curruntRecord.length; j++) { // On parcourt les colonnes de la ligne

  //           if(curruntRecord[j].includes('"')){ // On regarde si les éléments du csv sont entre guillemets ou pas

  //             // Ici on a un élément entre guillemets

  //             csvRecord.push(curruntRecord[j].split('"')[1]);
  //           }else{  
              
  //             // Ici l'élément n'est pas entre guillemets

  //             csvRecord.push(curruntRecord[j].trim());
  //           }
  //         }
  //         csvArr.push(csvRecord); // On ajoute la ligne traitée au tableau
  //         // this.adresses_service.addAdresse(csvRecord);

  //       }else{ // Ici il n'y a pas le bon nombre d'information dans la ligne du csv
  //         alert("Le fichier selectionné n'est pas valide : l'entête du fichier ne correspond pas au contenu du fichier. \n \n Une information est manquante ou en trop à la ligne " + (i+1) + ".");
  //         this.fileReset();
  //         break;
  //       }
  //     }

  //   }else{

  //     // Dans ce cas, le header est séparé par des points-virgules

  //     headerLength = headerRaw.split(';').length;

 
  //     for (let i = 1; i < csvRecordsArray.length; i++) { // On parcourt les lignes du csv
  //       const curruntRecord = (csvRecordsArray[i]).split(';');

  //       let csvRecord = [];

  //       if (curruntRecord.length == headerLength) { // On vérifie qu'il y a le bon nombre d'information dans la ligne du csv

  //         for (let j = 0; j < curruntRecord.length; j++) { // On parcourt les colonnes de la ligne

  //           if(curruntRecord[j].includes('"')){ // On regarde si les éléments du csv sont entre guillemets ou pas

  //             // Ici on a un élément entre guillemets

  //             csvRecord.push(curruntRecord[j].split('"')[1]);
  //           }else{  
              
  //             // Ici l'élément n'est pas entre guillemets

  //             csvRecord.push(curruntRecord[j].trim());
  //           }
  //         }
  //         csvArr.push(csvRecord); // On ajoute la ligne traitée au tableau
  //         // this.adresses_service.addAdresse(csvRecord);

  //       }else{ // Ici il n'y a pas le bon nombre d'information dans la ligne du csv
  //         alert("Le fichier selectionné n'est pas valide : l'entête du fichier ne correspond pas au contenu du fichier. \n \n Une information est manquante ou en trop à la ligne " + (i+1) + ".");
  //         this.fileReset();
  //         break;
  //       }
  //     }
  //   }
  //   return csvArr;
  // }
  // getJsonData(){
  //   this.jsondatadisplay = JSON.stringify(this.records);
  // }

  // getAdresses(){
  //   let reader = new FileReader();
  //   reader.onload = () => {
  //     let csvData = reader.result;
  //     if(typeof csvData == "string"){
  //       let csvRecordsArray = (csvData).split(/\r\n|\n/);

  //       let headersRow = this.getHeaderArray(csvRecordsArray);

  //       this.records = this.getDataRecordsArrayFromCSVFile(csvRecordsArray, headersRow.length);

  //       const adresses = [];
  //       for(let i=0; i<headersRow.length-1; i++){
          
  //         adresses.push(this.records[i].text);
  //       }
  //       return adresses;
  //     }
      
  //   return -1;
  //   };
  // }


//Check if the csv is valid
// function isValidCSVrows(csvRecordsArray: string[]) {
//   let isValidData: boolean = true;
//   let headersRow = (csvRecordsArray[0]).split(';');
//   // console.log(headersRow);
//   let numOfCols = headersRow.length;
//   if(numOfCols <= 1){
//     headersRow = (csvRecordsArray[0]).split(',');
//     numOfCols = (csvRecordsArray[0]).split(',').length;
//   }
//   // console.log(headersRow);
//   // for (let i = 1; i < csvRecordsArray.length-1; i++) {
//   //   let row = (csvRecordsArray[i]).split(';');
//   //   // console.log(row);
//   //   if (row.length !== numOfCols) {
//   //     isValidData = false;
//   //     break;
//   //   }
//   // }
//   return isValidData;
// }