import {Component, ViewChild, ElementRef, AfterViewInit} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {ColourService} from "./colour.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  colourApiPackage: any;
  @ViewChild('colourTest') colourTest!: ElementRef<HTMLElement>

  title = 'rgb-daily-webapp';

  constructor(private http: HttpClient, public colourService: ColourService) {
    colourService.setRedValue(this.getValueNumber())
    colourService.setGreenValue(this.getValueNumber())
    colourService.setBlueValue(this.getValueNumber())
  }
  getValueNumber() {
    return Math.round(Math.random() * 255);
  }

  ngAfterViewInit() {
    this.http.get<any>('https://www.thecolorapi.com/id?rgb=rgb('+this.colourService.getRedValue()+','+this.colourService.getGreenValue()+','+this.colourService.getBlueValue()+')').subscribe(data => {
      this.colourApiPackage = data.name.value
    })
    this.colourTest.nativeElement.style.backgroundImage = `linear-gradient(10deg, ${this.gradientValue(-50)} 0%, ${this.gradientValue(0)} 25%, ${this.gradientValue(0)} 50%, ${this.gradientValue(50)} 75%)`;

    if (this.darkColour()) {
      this.colourTest.nativeElement.style.color = 'white'
    }
  }
  gradientValue(value:number) {
    return `rgb(${this.colourService.getRedValue()+value}, ${this.colourService.getGreenValue()+value}, ${this.colourService.getBlueValue()+value})`
  }

  darkColour() {
    let lumR = this.lumValue(this.colourService.getRedValue());
    let lumG = this.lumValue(this.colourService.getGreenValue());
    let lumB = this.lumValue(this.colourService.getBlueValue());

    return (lumR * 0.2126 + lumG * 0.7152 + lumB * 0.0722) < 0.179
    // Basic luminance check
    // return (this.redValue*0.299 + this.greenValue*0.587 + this.blueValue*0.114) < 186
  }
  lumValue(lum: any): any {
    lum = lum / 255
    if(lum <= 0.04045) {
      lum = lum / 12.92
    } else {
      lum = Math.pow(((lum + 0.055) / 1.055), 2.4);
    }
    return lum
  }
}
