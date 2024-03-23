import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent{

  title = 'rgb-daily-webapp';
  redValue = Math.floor(Math.random() * 255); 
  greenValue = Math.floor(Math.random() * 255); 
  blueValue = Math.floor(Math.random() * 255); 

}
