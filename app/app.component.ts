import { Component } from '@angular/core';
import { CSVModel } from './csvmodel';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'D3Example';
  public records: CSVModel[] = [];

}
