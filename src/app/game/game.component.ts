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
    const newScore = this.calculateScore(guessedColour);
    this.score.set(newScore);
    this.showModal.set(true);

    const today = new Date().toDateString();
    localStorage.setItem('lastPlayDate', today);
    localStorage.setItem('lastScore', newScore.toString());
    this.hasPlayedToday.set(true);
  }

  calculateScore(guessedColour: { r: number, g: number, b: number }): number {
    const target = {
      r: this.colourService.getRedValue(),
      g: this.colourService.getGreenValue(),
      b: this.colourService.getBlueValue()
    };

    const maxDistance = Math.sqrt(Math.pow(255, 2) * 3);
    const distance = Math.sqrt(
      Math.pow(target.r - guessedColour.r, 2) +
      Math.pow(target.g - guessedColour.g, 2) +
      Math.pow(target.b - guessedColour.b, 2)
    );

    const score = 100 * (1 - distance / maxDistance);
    return Math.round(score);
  }

  closeModal() {
    this.showModal.set(false);
  }
}
