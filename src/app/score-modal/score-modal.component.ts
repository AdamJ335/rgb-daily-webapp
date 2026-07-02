import { Component, Input, Output, EventEmitter, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-score-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './score-modal.component.html',
  styleUrls: ['./score-modal.component.css']
})
export class ScoreModalComponent {
  @Input() score = 0;
  @Input() hueScore = 0;
  @Input() saturationScore = 0;
  @Input() lightnessScore = 0;
  @Input() show = false;
  @Output() close = new EventEmitter<void>();

  stars = computed(() => '⭐⭐⭐⭐⭐'.slice(0, Math.max(0, Math.min(5, Math.floor(this.score / 20)))));

  scoreMessage = computed(() => {
    if (this.score >= 95) {
      return "Incredible! You're a true Color-MASTER!";
    } else if (this.score >= 90) {
      return "Hue-reka! That's a brilliant score!";
    } else if (this.score >= 75) {
      return "Great eye! You're really getting the hang of it.";
    } else if (this.score >= 50) {
      return "Not bad! A solid effort, right in the ballpark.";
    } else if (this.score >= 25) {
      return "A bit off-hue, but don't be blue! Try again tomorrow.";
    } else {
      return "Are you seeing in grayscale? Better luck next time!";
    }
  });

  copyResults() {
    const results = `Colorfle\n${this.stars()}\n${this.score}`;
    navigator.clipboard.writeText(results).then(() => {
      // maybe show a "copied!" message
    }).catch(err => {
      console.error('Failed to copy results: ', err);
    });
  }

  closeModal() {
    this.close.emit();
  }
}
