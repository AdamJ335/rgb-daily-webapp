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
  @Input() show = false;
  @Output() close = new EventEmitter<void>();

  stars = computed(() => '⭐⭐⭐⭐⭐'.slice(0, Math.max(0, Math.min(5, Math.floor(this.score / 20)))));

  copyResults() {
    const results = `HueHunter\n${this.stars()}\n${this.score}`;
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
