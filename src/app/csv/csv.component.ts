// Imports
import { Component, VERSION ,ViewChild } from '@angular/core';
import { AdressesService } from '../adresses.service';
import { CsvServiceService } from '../csv-service.service';
import { FormControl, FormGroup } from '@angular/forms';
import {MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import * as moment from 'moment';
import Swal from 'sweetalert2';
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
  public rang:any;
  public row_data:any;
  public properties: any;
}

export const MY_FORMATS = {
  parse: {
    dateInput: 'YYYY', 
  },
  display: {
    dateInput: 'YYYY',
    monthYearLabel: 'YYYY',
    monthYearA11yLabel: 'YYYY',
  },
};

// Composent CsvComponent
@Component({
  selector: 'csv',
  templateUrl: './csv.component.html',
  styleUrls: [ './csv.component.css' ],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})

// Class CsvComponent où on définit les méthodes et les attributs de notre composent. Tout le code du component est dans cette classe.
export class CsvComponent  {
  name = 'Angular ' + VERSION.major; // Nom (inutile)

  public fileName:string= ''; // Nom du fichier importé

  public records: any[] = []; // Attribut qui va contenir les données du CSV

  public headersRow: any[] = []; // Attribut qui va contenir l'entête du CSV s'il existe

  public headerRowMapped = new Map();

  jsondatadisplay:any; // Attribut qui gère si l'on veut afficher en JSON les données, pas utilisé pour le moment

  public display_button_geo:boolean = false; // Attribut qui gère l'affichage ou non du boutton géocodage

  public csv_valid:boolean = false; // Attribut qui représente la validité ou non du fichier uploadé par l'utilisateur

  public showSpinner:boolean = false; // Attribut qui gère l'affichage ou non du cercle de chargement du fichier

  public displayLimit:number = 10; // Nombre de lignes qu'on affiche dans l'aperçu du fichier

  public displayRecords: any[] = []; // Attribut qui va contenir les données du CSV qu'on va afficher dans l'aperçu

  public showAdvanced:boolean = false; // Attribut qui gère l'affichage ou non du boutton paramètre avancé

  @ViewChild('csvReader') csvReader: any; // Lecteur du CSV qu'on ré-initialise au besoin (exemple le fichier n'est pas un csv, on ré-initialise le lecteur)
  
  selectedColumnsForAdress: any[] = []; // Colonnes séléctionnées par l'utilisateur pour construire l'adresse

  selectedColumnsForDate: any[] = []; // Colonnes séléctionnées par l'utilisateur pour construire la date

  public isGeoClicked:boolean = false; // Booléen qui dit si le bouton géocodage est cliqué ou non

  public CsvDataResult: CsvData[] = []; // Attribut qui va contenir les données du CSV s'il existe

  public previsualisationAdress: string = ''; // Prévisulation de l'adresse construite par l'utilisateur avec les colonnes qu'il sélectionner

  public previsualisationDate: string = ''; // Prévisulation de la date construite par l'utilisateur avec les colonnes qu'il sélectionner

  public startDate: Date = new Date(1800,1,1); // Date de début du calendrier servant à l'utilisateur pour choisir la date de la reqûete

  public endDate : Date = new Date (2000,1,1); // Date de fin du calendrier servant à l'utilisateur pour choisir la date de la reqûete

  public dateSelection : number = 0; // Numéro définissant si on choisit une ou deux dates variant en fonction du click sur le bouton radio 

  public distanceValue : number = 0; // Numéro contenant la variable de distance temporelle réglée par l'utilisateur avec le slider

  public startDistDate:number = 0; // Année de départ de la date avec la distance temporelle

  public endDistDate:number = 0; // Année de fin de la date avec la distance temporelle

  public selectionManuelle:boolean = false; // Booléen représentant si l'utilisateur veut choisir ses colonnes à la main ou non 
  
  public UIForm = new FormGroup({
    yearSelector: new FormControl(moment()),
  }); 

  public date = new FormControl(moment());

  public chosenYear:any = new Date(0,0); // Date choisie par l'utilisateur dans le calendrier pour une distance temporelle
  public chosenStartYear:any = new Date(0,0); // Date choisie de début par l'utilisateur pour une fenêtre temporelle
  public chosenEndYear:any = new Date(0,0); // Date choisie de fin par l'utilisateur pour une fenêtre temporelle

  public dateRange = new FormGroup({ // On crée un objet DataRange pour récupérer les dates données par l'utilisateur
    start: new FormControl(),
    end: new FormControl()
  });

  constructor(private adresses_service : AdressesService, private csvService : CsvServiceService){
  }

  uploadListener($event: any): void { // Méthode principale de la classe où quasiment tout est fait
    
    this.displayLoader(); // On affiche le loader

    let files = $event.srcElement.files; // Fichier importé par l'utilisateur

    if (this.isValidCSVFile(files[0])) { // On vérifie que le fichier est valide en utilisant la méthode isValidCSVFile

      // Ici le fichier est valide

      this.fileName = files[0].name; // On récupère le nom du fichier

      this.csv_valid=true; // On change l'attribut csv_valid car le fichier est valide 

      this.display_button_geo=true; // On affiche le boutton géocodage

      let input = $event.target;
      let reader = new FileReader();
      reader.readAsText(input.files[0]); // Avec ces 3 lignes on lit le fichier importé par l'utilisateur

      reader.onerror = function () { // Si le fichier n'est pas valide on affiche un message d'erreur dans la console pour les développeurs :)
        console.log('error is occured while reading file!');};

      reader.onload = () => { // Une fois le fichier chargé on peut le manipuler

        this.previsualisationDate = ''; // On vide la prévisualisation
        this.previsualisationAdress = ''; // On vide la prévisualisation

        this.selectedColumnsForAdress = []; // On vide les colonnes séléctionnées pour l'adresse

        let csvData = reader.result; // CsvData contient les données "brutes" du fichier 

        let resultat: any[] = []; // On crée l'objet resultat qui contient les données traitées. Records deviendra resultat à la fin du traitement

        let display: any[] = []; // On crée l'objet qui va contenir les données à afficher dans l'aperçu

        if(typeof csvData == "string"){ // On vérifie que les données sont bien des chaînes de caractères

          let csvRecordsArray = (csvData).split(/\r\n|\n/); // On sépare les lignes du fichier

          this.headersRow = this.getHeaderArray(csvRecordsArray); // On récupere l'entête du fichier avec la méthode getHeaderArray

          this.csvService.setHeader(this.headersRow); // On envoie l'entête au service csvService pour qu'il puisse le récupérer

          for(let k=0; k<this.headersRow.length; k++){

            this.headerRowMapped.set(this.headersRow[k], k); // On crée un objet qui va contenir les clés et les valeurs de l'entête

          }

          const limite = this.displayLimit; // On donne à limite la limite de ligne à afficher dans l'aperçu

          Papa.parse(files[0], { // On utilise papa.parse pour parser le fichier

            download: true,
            header: false, // On indique qu'il n'y a pas de header car on le traite séparement avec la méthode getHeaderArray

            complete: function(results: { data: any[]; }) {
              results.data.map((data, index)=> {
                if(index == 0){
                  return;
                }else{
                  if(results.data.length < limite){ // On vérifie que le nombre de lignes du fichier est inférieur à la limite d'affichage

                    // Ici on a moins de lignes que la limite d'affichage dans notre fichier
      
                    resultat.push(data); // On ajoute toutes les autres données parsées dans l'objet résultat

                    display.push(data); // On met les données dans l'objet qui va être affiché dans l'aperçu
                  } else {

                    // Ici on a plus de lignes que la limite d'affichage dans notre fichier
                    while(index <= limite){ // On boucle tant que l'on a pas atteint la limite d'affichage
                      display.push(data); // On ajoute les données parsées par papa.parse dans l'objet qui va contenir les données à afficher dans l'aperçu
                      break;
                    }
                    resultat.push(data); // On continue d'ajouter les données parsées par papa.parse dans l'objet résultat
                  }
                }
              });
            }
          });

          this.records = resultat; // L'objet records prend les données parsées par papa.parse

          this.csvService.setCsvData(this.records); // On met les données parsées dans le service csv pour pouvoir les utiliser lors de la génération du fichier résulat

          this.displayRecords = display; // L'objet displayRecords prend les données à afficher dans l'aperçu du fichier

          this.hideLoader(); // On cache le loader

          // On est toujours dans l'évenement onload, on change alors la couleur des textes pour montrer que le fichier est chargé

          const inputCSV = document.getElementById("txtFileUpload"); // On récupère l'objet HTML permettant de charger le fichier
          
          if(inputCSV){ // On vérifie que l'objet existe
            const text2 = document.querySelector<HTMLElement>("#two"); // On récupère l'objet HTML correspondant au 2.
            const text3 = document.querySelector<HTMLElement>("#three"); // On récupère l'objet HTML correspondant au 3.
            const text4 = document.querySelector<HTMLElement>("#four"); // On récupère l'objet HTML correspondant au 3.
            const colonnes = document.querySelectorAll<HTMLElement>(".colonnes"); // On récupère l'objet HTML correspondant aux colonnes sélectionnées.
            const button1 = document.querySelector<HTMLElement>("#five"); // On récupère l'objet HTML correspondant au bouton 1.

            if(text2){ // On vérifie que l'objet existe

              text2.style.color = "black"; // On change la couleur et l'épaisseur du texte 
              text2.style.fontWeight = "bold";
            }
            if(text3){ // On vérifie que l'objet existe

              text3.style.color = "black"; // On change la couleur et l'épaisseur du texte
              text3.style.fontWeight = "bold";
            }
            if(text4){// On vérifie que l'objet existe
              
              text4.style.color = "black"; // On change la couleur et l'épaisseur du texte
              text4.style.fontWeight = "bold";
              // text4.style.height = "100px";

            }
            if(colonnes){ // On vérifie que l'objet existe

              colonnes[0].style.display = "block"; // On affiche les colonnes sélectionnées
              colonnes[1].style.display = "block"; // On affiche les colonnes sélectionnées
              // console.log(colonnes);
            }
            if(button1){ // On vérifie que l'objet existe

              button1.style.display = "block"; // On affiche le bouton
            }
          };

        } else {

          // Ici les données ne son pas des chaînes de caractères

          Swal.fire("Les données dans le fichier ne sont pas valides.", "Veuillez importer un fichier contenant uniquement des chiffres et des lettres."); // On affiche un message d'erreur

          this.hideLoader(); // On cache le loader

          this.fileReset(); // On ré-initialise le lecteur du fichier avec la méthode fileReset
        }
      };

      reader.onloadend = () => { // Une fois le fichier chargé on arrête le cercle de chargement
        this.hideLoader();
      } 
      

    } else {

      // Ici le fichier est invalide

      Swal.fire( "Le fichier n'est pas valide.", "Veuillez importer un fichier csv (finissant par .csv).") // On affiche un message d'erreur

      this.hideLoader(); // On cache le loader

      this.fileReset(); // On ré-initialise le lecteur du fichier avec la méthode fileReset

      // On change alors les couleurs des textes pour montrer que le fichier n'est pas valide

      const inputCSV = document.getElementById("txtFileUpload"); // On récupère l'objet HTML permettant de charger le fichier
          
      if(inputCSV){ // On vérifie que l'objet existe

        const text2 = document.querySelector<HTMLElement>("#two"); // On récupère l'objet HTML correspondant au 2.
        const text3 = document.querySelector<HTMLElement>("#three"); // On récupère l'objet HTML correspondant au 3.
        const text4 = document.querySelector<HTMLElement>("#four"); // On récupère l'objet HTML correspondant au 3.

        if(text2){ // On vérifie que l'objet existe

          text2.style.color = "rgba(174, 191, 206, 0.76)"; // On change la couleur et l'épaisseur du texte 
          text2.style.fontWeight = "300";
        }
        if(text3){ // On vérifie que l'objet existe

          text3.style.color = "rgba(174, 191, 206, 0.76)"; // On change la couleur et l'épaisseur du texte
          text3.style.fontWeight = "300";
        }
        if(text4){ // On vérifie que l'objet existe

          text4.style.color = "rgba(174, 191, 206, 0.76)"; // On change la couleur et l'épaisseur du texte 
          text4.style.fontWeight = "300";
        }
      };

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
    this.csvService.cleanCsvData();
  }

  hideLoader(){ // On cache le loader
    const loader = document.getElementById('loading'); // On récupère l'objet HTML correspondant au loader
    if(loader){ // On vérifie que l'objet existe

      loader.style.display = "none"; // On cache le loader
    }
  }  

  displayLoader(){ // On affiche le loader
    const loader = document.getElementById('loading'); // On récupère l'objet HTML correspondant au loader
    if(loader){ // On vérifie que l'objet existe
      loader.style.display = "flex"; // On affiche le loader
    }
  }

  getColumnSelectedForAdresse(header: any){ // On récupère les colonnes sélectionnées par l'utilisateur pour l'adresse

    for(let i=0; i<this.selectedColumnsForAdress.length+1; i++){ // On parcourt les éléments du tableau contenant les colonnes sélectionnées par l'utilisateur pour l'adresse

      if(this.selectedColumnsForAdress[i] == header){ // On vérifie que la colonne n'est pas déjà dans le tableau

        // Ici la colonne est déjà dans le tableau on la supprime donc

        this.selectedColumnsForAdress.splice(i, 1); // On supprime l'élément du tableau

        return; // On quitte la fonction
      }
    }  
    // Ici la colonne n'est pas dans le tableau

    this.selectedColumnsForAdress.push(header); // On ajoute la colonne sélectionnée dans le tableau des colonnes sélectionnées pour l'adresse
  }

  getColumnSelectedForDate(header: any){ // On récupère les colonnes sélectionnées par l'utilisateur pour la date

    for(let i=0; i<this.selectedColumnsForDate.length+1; i++){ // On parcourt les éléments du tableau contenant les colonnes sélectionnées par l'utilisateur pour la date 

      if(this.selectedColumnsForDate[i] == header){ // On vérifie que la colonne n'est pas déjà dans le tableau

        // Ici la colonne est déjà dans le tableau on la supprime donc

        this.selectedColumnsForDate.splice(i, 1); // On supprime l'élément du tableau

        return; // On quitte la fonction
      }
    }  
    // Ici la colonne n'est pas dans le tableau

    this.selectedColumnsForDate.push(header); // On ajoute la colonne sélectionnée dans le tableau des colonnes sélectionnées pour la date
  }

  isGeocodageClicked(){ // Si le boutton de géocodage est cliqué on ajoute les éléments de la requête dans un objet CsvData  

    this.isGeoClicked = !this.isGeoClicked; // On inverse la valeur de la variable isGeoClicked

    let csvArr: any[] = []; // On crée un tableau vide qui va contenir les objects CsvData

    for(let i = 0; i<this.records.length; i++){ // On parcourt les lignes du fichier

      let csvRecord: CsvData = new CsvData(); // On crée un objet CsvData qui va permettre de faire la requête

      if(this.selectedColumnsForAdress.length == 0){ // Ici on vérifie que les colonnes sélectionnées pour les adresses sont bien remplies

        Swal.fire("Il n'y a pas de colonnes séléectionnées.", "Veuillez sélectionner les colonnes nécessaire à la construction de l'adresse."); // On affiche un message d'erreur

      } else if(this.selectedColumnsForAdress.length == 1){

        csvRecord.text = this.records[i][this.headerRowMapped.get(this.selectedColumnsForAdress[0])]; // On récupère la valeur de la colonne sélectionnée pour les adresses

      } else if(this.selectedColumnsForAdress.length > 1){

        csvRecord.text = '';

        for(let j=0; j<this.selectedColumnsForAdress.length; j++){ // On parcourt les colonnes sélectionnées pour les adresses
          csvRecord.text += this.records[i][this.headerRowMapped.get(this.selectedColumnsForAdress[j])] + " "; // On récupère la valeur de la colonne sélectionnée pour les adresses
        }
      }

      const referenceDate = new Date(0,0); // Date de référence qui est la même que les chosendates si l'utilisateur n'utilise pas le calendrier

      if((typeof(this.chosenYear) != "number") && (typeof(this.chosenEndYear) != "number")){
        console.log("Ici on est dans le cas où l'utilisateur n'a pas sélectionné de date avec le calendrier");
        if(this.selectedColumnsForDate.length == 0){ // Ici on vérifie que les colonnes sélectionnées pour les adresses sont bien remplies

          Swal.fire("Il n'y a pas de colonnes séléectionnées.", "Veuillez sélectionner les colonnes nécessaire à la construction des dates (années)."); // On affiche un message d'erreur

        } else if(this.selectedColumnsForDate.length == 1){

          csvRecord.startingTime = this.records[i][this.headerRowMapped.get(this.selectedColumnsForDate[0])]; // On récupère la valeur de la colonne sélectionnée pour la date
          csvRecord.endingTime = this.records[i][this.headerRowMapped.get(this.selectedColumnsForDate[0])]; // On récupère la valeur de la colonne sélectionnée pour la date

        } else if(this.selectedColumnsForDate.length == 2){

          for(let j=0; j<this.selectedColumnsForDate.length; j++){ // On parcourt les colonnes sélectionnées pour les adresses
            csvRecord.startingTime = this.records[i][this.headerRowMapped.get(this.selectedColumnsForDate[0])]; // On récupère la valeur de la colonne sélectionnée pour la date de début
            csvRecord.endingTime = this.records[i][this.headerRowMapped.get(this.selectedColumnsForDate[1])]; // On récupère la valeur de la colonne sélectionnée pour la date de fin
          }
        }

      } else if (typeof(this.chosenEndYear) != "number") {

        console.log("Ici on est dans le cas où l'utilisateur a sélectionné une date avec le calendrier pour une distance temporelle");
        csvRecord.startingTime = (this.chosenYear - (this.distanceValue / 2)).toString(); // On donne à la valeur de début la valeur donnée par l'utilsateur avec le calendrier moins la distance temporelle divisé par 2 pour respecter la fenêtre donnée par l'utilisateur
        csvRecord.endingTime = (this.chosenYear + (this.distanceValue / 2)).toString(); // On donne à la valeur de fin la valeur donnée par l'utilsateur avec le calendrier plus la distance temporelle divisé par 2 pour respecter la fenêtre donnée par l'utilisateur
        
      } else {

        console.log("Ici on est dans le cas où l'utilisateur a sélectionné deux dates avec le calendrier pour une fenêtre temporelle");
        csvRecord.startingTime = this.chosenStartYear.toString(); // On donne à la valeur de début la valeur donnée par l'utilsateur avec le calendrier
        csvRecord.endingTime = this.chosenEndYear.toString(); // On donne à la valeur de fin la valeur donnée par l'utilisateur avec le calendrier

      }

      csvRecord.softTime = 1; // On ajoute la valeur de la variable softTime
      csvArr.push(csvRecord);

      if(csvRecord.text.trim() != '' && ((csvRecord.startingTime.trim() != '' ) || (csvRecord.endingTime.trim() != '') )){ // On vérifie que la valeur de la colonne sélectionnée pour les adresses et l'adresse est bien remplie
        this.adresses_service.addAdresse(csvRecord); // On ajoute l'adresse et la date au service qui va faire la requête
      } else {
        console.log("-------------------------------------------")
      }
    }
    this.CsvDataResult = csvArr; // On renvoie le tableau
  }  

  previz(){ // On donne à l'utilisateur une prévisulisation de l'adresse qu'il construit

    this.previsualisationDate = ''; // On vide la variable prévisualisation
    this.previsualisationAdress = ''; // On vide la variable prévisualisation

    for(let i = 0; i<this.selectedColumnsForAdress.length; i++){ // On parcourt les colonnes sélectionnées pour les adresses

      let index = this.headerRowMapped.get(this.selectedColumnsForAdress[i]); // On récupère l'index de la colonne sélectionnée pour les adresses
      this.previsualisationAdress += this.records[0][index].toString() + ' '; // On récupère la valeur de la colonne sélectionnée pour les adresses

    }

    for(let i = 0; i<this.selectedColumnsForDate.length; i++){ // On parcourt les colonnes sélectionnées pour les adresses

      if(i==1){ this.previsualisationDate += " - "; } // On ajoute un tiret pour séparer les dates quand il y en a deux
      let index = this.headerRowMapped.get(this.selectedColumnsForDate[i]); // On récupère l'index de la colonne sélectionnée pour les adresses
      this.previsualisationDate += this.records[0][index].toString() + ' '; // On récupère la valeur de la colonne sélectionnée pour les adresses

    }
  }

  radioSelect(value:number){ // On récupère la valeur de la variable radio pour savoir si on utilise une fenêtre temporelle ou une distance temporelle
    if(value == 1){
      this.dateSelection = 1; // On donne à la variable dateSelection la valeur 1 ie: la fenêtre temporelle
    } else if(value == 2 ){
      this.dateSelection = 2; // On donne à la variable dateSelection la valeur 2 ie: la distance temporelle
    }
  }

  radio(value:number){ // On récupére la valeur de la variable radio pour savoir si on sélectionne la data à la main ou non
    if(value == 1){
      this.selectionManuelle = false; // On affiche pas le calendrier pour choisir les dates
      this.dateSelection = 0; // On donne à la variable dateSelection la valeur 0 ie: on affiche pas les calendriers
    } else if(value == 2 ){
      this.selectionManuelle = true; // On affiche le calendrier pour choisir les dates
    }
  }

  getDate(event:any){ // On récupère la valeur de la date 
    this.chosenYear = event.target.value._i.year; // On récupère l'année choisie
  }

  getStartDate(event:any){ // On récupère la valeur de la date de début
    this.chosenStartYear = event.target.value._i.year; // On récupère l'année choisie
  }

  getEndDate(event:any){ // On récupère la valeur de la date de fin
    this.chosenEndYear = event.target.value._i.year; // On récupère l'année choisie
  }

  displaySliderValue(){ // Fonction pour suivre la valeur du slider et afficher la valeur dans la console pour les developpeurs (coucou :) )
    console.log(this.distanceValue);
  }
}

// ANCIEN CODE POUVANT ETRE UTILE
  // getSelectedColumns(){ // on récupère les colonnes sélectionnées par l'utilisateur

  //   const inputCSV = document.getElementById("txtFileUpload"); // On récupère l'objet HTML permettant de charger le fichier

  //   if(inputCSV){ // On vérifie que l'objet existe

  //     const text4 = document.querySelectorAll<HTMLElement>(".colonnes"); // On récupère l'objet HTML correspondant au 4.

  //     if(text4){ // On vérifie que l'élément existe

  //       const rawTextAdress = text4[0].innerHTML; // On récupère le texte brut de l'objet HTML pour les adresses

  //       const rawColumnsAdress = rawTextAdress.split(":")[1]; // On récupère ce qu'il y a après "Colonnes sélectionnées : " soit les colonnes sélectionnées pour les adresses

  //       const columnsAdress = rawColumnsAdress.split(","); // On obtient la la liste des colonnes sélectionnées pour les adresses

  //       const rawTextDate = text4[1].innerHTML; // On récupère le texte brut de l'objet HTML pour les dates

  //       const rawColumnsDate = rawTextDate.split(":")[1]; // On récupère ce qu'il y a après "Colonnes sélectionnées : " soit les colonnes sélectionnées  pour les dates

  //       const columnsDate = rawColumnsDate.split(","); // On obtient la la liste des colonnes sélectionnées pour les dates

  //       const result = []; // On crée un tableau vide qui va contenir les colonnes sélectionnées

  //       result.push(rawColumnsAdress); // On ajoute les colonnes sélectionnées pour les adresses

  //       result.push(rawColumnsDate); // On ajoute les colonnes sélectionnées pour les dates

  //       console.log(result);

  //       return result; // On renvoie cette liste
  //     }
  //   }
  //   return null; // Dans le cas où les if ne sont pas respectés on renvoie null
  // }
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