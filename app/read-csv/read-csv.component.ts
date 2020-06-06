import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CSVModel } from '../csvmodel';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-read-csv',
  template: `<input type='file' #CsvFileReader name='Upload CSV File' id='CSVFile' (change)='UploadAndReadCsvFile($event)'
              accept='.csv'/>`,
  styleUrls: ['./read-csv.component.css']
})
export class ReadCsvComponent implements OnInit {
  public records: CSVModel[] = [];
  csvReader: CSVModel;
  @Output() Data = new EventEmitter();

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.http.get('./assets/demoData/demoFile.csv', {responseType: 'text'})
    .subscribe(
        data => {
          console.log(data);
          const temp = data.split(/\r\n|\n/);
          this.records = this.getDataRecordsArrayFromCSVFile(temp);
          console.log(this.records);
        },
        error => {
            console.log(error);
        }
    );
  }

  UploadAndReadCsvFile($event: any): void {

    const text = [];
    const files = $event.srcElement.files;

    if (this.isValidCSVFile(files[0])) {

      const input = $event.target;
      const reader = new FileReader();
      reader.readAsText(input.files[0]);

      reader.onload = () => {
        const csvData = reader.result;
        const csvRecordsArray = ( csvData as string).split(/\r\n|\n/);

        this.records = this.getDataRecordsArrayFromCSVFile(csvRecordsArray);
        console.log(this.records);
        this.Data.emit(this.records);
      };

      reader.onerror = () => {
        console.log('error is occured while reading file!');
      };

    } else {
      alert('Please import valid .csv file.');
      this.fileReset();
    }
  }

  getDataRecordsArrayFromCSVFile(csvRecordsArray: any): CSVModel[] {
    const csvArr: CSVModel[] = [];
    const MaxRecord = new CSVModel();
    MaxRecord.Brand = 'Total KO';
    MaxRecord.val_2 = MaxRecord.val_1 = MaxRecord.max_val = 0;
    // tslint:disable-next-line: prefer-for-of
    for (let i = 1; i < csvRecordsArray.length ; i++) {
      const curruntRecord = ( csvRecordsArray[i] as string).split(',');
      if (curruntRecord.length === 4) {
        console.log(curruntRecord + ' ' + curruntRecord.length);
        const csvRecord = new CSVModel();
        csvRecord.Brand = curruntRecord[0].trim();
        csvRecord.val_1 = Number(curruntRecord[1].trim());
        MaxRecord.val_1 += csvRecord.val_1;
        csvRecord.val_2 = Number(curruntRecord[2].trim());
        MaxRecord.val_2 += csvRecord.val_2;
        csvRecord.max_val = Number(curruntRecord[3].trim());
        MaxRecord.max_val += csvRecord.max_val;
        csvArr.push(csvRecord);
      }
    }
    csvArr.unshift(MaxRecord);
    return csvArr;
  }

  isValidCSVFile(file: any) {
    return file.name.endsWith('.csv');
  }

  getHeaderArray(csvRecordsArr: any) {
    const headers = ( csvRecordsArr[0] as string).split(',');
    const headerArray = [];
    headers.forEach(header => {
      headerArray.push(header);
    } );
    return headerArray;
  }

  fileReset() {
    this.csvReader = new CSVModel();
    this.records = [];
  }


}
