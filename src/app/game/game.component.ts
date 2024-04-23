import { Component } from '@angular/core';
import {ColourService} from "../colour.service";
import {AsyncPipe, NgIf} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {Observable} from "rxjs";

@Component({
  selector: 'game',
  standalone: true,
  imports: [
    AsyncPipe,
    FormsModule,
    NgIf
  ],
  templateUrl: './game.component.html',
  styleUrl: './game.component.css'
})
export class GameComponent {

  colourInput:any
  guessedColour:any
  colourName!: Observable<string>
  colourCorrect: boolean = false
  guessCount:number = 0
  maxGuessCount:number = 5
  maxGuessReached:boolean = false

  constructor(protected colourService: ColourService) {
  }

  async checkColour() {
    this.guessCount++;
    if(this.guessCount == this.maxGuessCount){
      this.maxGuessReached = true
    } else if (this.guessCount > this.maxGuessCount) {
      return
    }

    this.colourName = this.colourService.getNameByHex(this.colourInput);
    this.guessedColour = this.hexToRgb(this.colourInput);
    console.log(this.colourName)
    console.log(this.guessedColour)
    console.log("colour checked!")

    if(this.guessIsCorrect(this.guessedColour)) {
      this.colourCorrect = true;
    }
  }


  hexToRgb(hex:any) {
    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  guessIsCorrect(guessedColour:any) {
    return guessedColour.r == this.colourService.getRedValue() &&
      guessedColour.g == this.colourService.getGreenValue() &&
      guessedColour.b == this.colourService.getBlueValue()
  }
}
