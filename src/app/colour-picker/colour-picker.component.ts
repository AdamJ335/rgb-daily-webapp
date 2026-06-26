import { Component, signal, computed, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-colour-picker',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './colour-picker.component.html',
  styleUrls: ['./colour-picker.component.css']
})
export class ColourPickerComponent {
  // Signals for HSL values
  hue = signal(180);
  saturation = signal(50);
  lightness = signal(50);

  // Computed signal for the HSL color string
  hslColor = computed(() => `hsl(${this.hue()}, ${this.saturation()}%, ${this.lightness()}%)`);

  // Computed signals for dynamic slider backgrounds
  saturationBackground = computed(() => `linear-gradient(to right, hsl(${this.hue()}, 0%, 50%), hsl(${this.hue()}, 100%, 50%))`);
  lightnessBackground = computed(() => `linear-gradient(to right, black, hsl(${this.hue()}, ${this.saturation()}%, 50%), white)`);

  @Output() colorChanged = new EventEmitter<{ h: number, s: number, l: number }>();

  onHueChange(event: Event) {
    this.hue.set(+(event.target as HTMLInputElement).value);
    this.emitColor();
  }

  onSaturationChange(event: Event) {
    this.saturation.set(+(event.target as HTMLInputElement).value);
    this.emitColor();
  }

  onLightnessChange(event: Event) {
    this.lightness.set(+(event.target as HTMLInputElement).value);
    this.emitColor();
  }

  emitColor() {
    this.colorChanged.emit({ h: this.hue(), s: this.saturation(), l: this.lightness() });
  }

  // Public method to get the current color in RGB format
  public getRgb(): { r: number; g: number; b: number } {
    const h = this.hue() / 360;
    const s = this.saturation() / 100;
    const l = this.lightness() / 100;

    let r, g, b;

    if (s === 0) {
      r = g = b = l; // achromatic
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }

    return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
  }
}