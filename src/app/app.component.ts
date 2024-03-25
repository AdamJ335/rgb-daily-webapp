import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  colourApiPackage: any;

  title = 'rgb-daily-webapp';
  redValue = this.getValueNumber();
  greenValue = this.getValueNumber();
  blueValue = this.getValueNumber();
  
  getValueNumber() {
    return Math.floor(Math.random() * 255);
  }
  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.http.get<any>('https://www.thecolorapi.com/id?rgb=rgb('+this.redValue+','+this.greenValue+','+this.blueValue+')').subscribe(data => {
      this.colourApiPackage = data.name.value
    })
  }
}