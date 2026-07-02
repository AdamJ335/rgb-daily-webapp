import { Component, ViewChild, signal, OnInit } from '@angular/core';
import { ColourService } from "../colour.service";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ColourPickerComponent } from "../colour-picker/colour-picker.component";
import { ScoreModalComponent } from "../score-modal/score-modal.component";

@Component({
  selector: 'game',
  standalone: true,
  imports: [
    FormsModule,
    ColourPickerComponent,
    ScoreModalComponent,
    CommonModule
  ],
  templateUrl: './game.component.html',
  styleUrl: './game.component.css'
})
export class GameComponent implements OnInit {
  @ViewChild(ColourPickerComponent) colourPicker!: ColourPickerComponent;

  colourName: string | undefined
  score = signal(0);
  showModal = signal(false);
  hasPlayedToday = signal(false);
  hueScore = signal(0);
  saturationScore = signal(0);
  lightnessScore = signal(0);

  constructor(private colourService: ColourService) {
  }

  ngOnInit() {
    this.colourService.getColourName().subscribe({
      next: (name) => {
        this.colourName = name
      },
      error: err => console.error('Something went wrong: ', err)
    })
    const lastPlayDate = localStorage.getItem('lastPlayDate');
    const today = new Date().toDateString();
    if (lastPlayDate === today) {
      this.hasPlayedToday.set(true);
      this.score.set(parseInt(localStorage.getItem('lastScore') || '0', 10));
      this.showModal.set(true);
    }
  }

  async checkColour() {
    if (this.hasPlayedToday()) return;

    const guessedColour = this.colourPicker.getRgb();
    const targetColour = {
      r: this.colourService.getRedValue(),
      g: this.colourService.getGreenValue(),
      b: this.colourService.getBlueValue()
    };
    const { hueScore, saturationScore, lightnessScore, overallScore } = this.calculateScore(guessedColour, targetColour);
    this.hueScore.set(hueScore);
    this.saturationScore.set(saturationScore);
    this.lightnessScore.set(lightnessScore);
    this.score.set(overallScore);
    this.showModal.set(true);

    const today = new Date().toDateString();
    localStorage.setItem('lastPlayDate', today);
    localStorage.setItem('lastScore', overallScore.toString());
    this.hasPlayedToday.set(true);
  }

  calculateScore(guessedColour: { r: number, g: number, b: number }, targetColour: { r: number, g: number, b: number }): { hueScore: number, saturationScore: number, lightnessScore: number, overallScore: number } {
    const guessedHsl = this.rgbToHsl(guessedColour.r, guessedColour.g, guessedColour.b);
    const targetHsl = this.rgbToHsl(targetColour.r, targetColour.g, targetColour.b);

    // Hue difference is circular
    const hueDiff = Math.min(Math.abs(targetHsl.h - guessedHsl.h), 360 - Math.abs(targetHsl.h - guessedHsl.h));
    const saturationDiff = Math.abs(targetHsl.s - guessedHsl.s);
    const lightnessDiff = Math.abs(targetHsl.l - guessedHsl.l);

    const hueScore = Math.round(100 * (1 - hueDiff / 180)); // Max difference is 180
    const saturationScore = Math.round(100 * (1 - saturationDiff / 100));
    const lightnessScore = Math.round(100 * (1 - lightnessDiff / 100));

    // Original RGB distance score
    const maxDistance = Math.sqrt(Math.pow(255, 2) * 3);
    const distance = Math.sqrt(
      Math.pow(targetColour.r - guessedColour.r, 2) +
      Math.pow(targetColour.g - guessedColour.g, 2) +
      Math.pow(targetColour.b - guessedColour.b, 2)
    );
    const overallScore = Math.round(100 * (1 - distance / maxDistance));

    return { hueScore, saturationScore, lightnessScore, overallScore };
  }

  rgbToHsl(r: number, g: number, b: number): { h: number, s: number, l: number } {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return { h: h * 360, s: s * 100, l: l * 100 };
  }
  closeModal() {
    this.showModal.set(false);
  }
}
