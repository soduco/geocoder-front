import { Component, VERSION ,ViewChild } from '@angular/core';
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

          let headersRow = this.getHeaderArray(csvRecordsArray);

          this.records = this.getDataRecordsArrayFromCSVFile(csvRecordsArray, headersRow.length);
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

    for (let i = 1; i < csvRecordsArray.length; i++) {
      // console.log((csvRecordsArray[i]).split(';'));
      let curruntRecord = (csvRecordsArray[i]).split(';');
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

//check etension
  isValidCSVFile(file: any) {
    return file.name.endsWith(".csv");
  }

  getHeaderArray(csvRecordsArr: any) {
    let headers = (csvRecordsArr[0]).split(';');
    let headerArray = [];
    for (let j = 0; j < headers.length; j++) {
      headerArray.push(headers[j]);
    }
    return headerArray;
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