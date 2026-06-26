import {Component, ViewChild, ElementRef, AfterViewInit} from '@angular/core';
import {ColourService} from "./colour.service";
import { GameComponent } from "./game/game.component";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,
  imports: [
    GameComponent
  ],
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  colourApiPackage: any;
  @ViewChild('colourTest') colourTest!: ElementRef<HTMLElement>

  title = 'rgb-daily-webapp';

  constructor(public colourService: ColourService) {
    this.colourService.loadDailyColour().subscribe(() => {
      this.ngAfterViewInit();
    });
  }

  ngAfterViewInit() {
    if (!this.colourTest) {
      return;
    }
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
