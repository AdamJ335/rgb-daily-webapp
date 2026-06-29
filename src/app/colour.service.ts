import { Injectable } from '@angular/core';
import { HttpService } from "./http-service.service";
import { Observable, map, of } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ColourService {

  dailyColour: { r: number, g: number, b: number } | null = null;

  constructor(private httpService: HttpService) { }

  private seededRandom(seed: number): () => number {
    return function() {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };
  }
  loadDailyColour(): Observable<{ r: number, g: number, b: number }> {
    // 1. Get today's date in YYYY-MM-DD format (e.g., "2026-06-29")
    const today = new Date().toISOString().slice(0, 10);
    const storedDate = localStorage.getItem('generationDate');
    const storedColor = localStorage.getItem('dailyColour');

    // 2. If it's the same day and we already saved it, just use it
    if (storedDate === today && storedColor) {
      this.dailyColour = JSON.parse(storedColor);
      return of(this.dailyColour!);
    }

    // 3. NEW DAY: Generate a globally synced color using the date as a seed
    // Turn "2026-06-29" into the number 20260629
    const numericSeed = Number(today.replace(/-/g, ''));
    const rand = this.seededRandom(numericSeed);

    // Because 'rand()' uses the exact same seed for everyone today,
    // it will output the exact same numbers for every user globally.
    const newSyncedColor = {
      r: Math.floor(rand() * 256),
      g: Math.floor(rand() * 256),
      b: Math.floor(rand() * 256),
    };

    // 4. Save to local storage so we don't have to re-run the math on every single refresh
    localStorage.setItem('generationDate', today);
    localStorage.setItem('dailyColour', JSON.stringify(newSyncedColor));
    this.dailyColour = newSyncedColor;

    return of(newSyncedColor);
  }

  getRedValue(): number {
    return this.dailyColour ? this.dailyColour.r : 0;
  }

  getGreenValue(): number {
    return this.dailyColour ? this.dailyColour.g : 0;
  }

  getBlueValue(): number {
    return this.dailyColour ? this.dailyColour.b : 0;
  }

  getColourName(): Observable<string> {
    return this.httpService.get('https://www.thecolorapi.com/',`id?rgb=${this.getRedValue()},${this.getGreenValue()}, ${this.getBlueValue()}`)
      .pipe(map((response: any) => {
        // console.log(response);
        // console.log(response.name.value);
        return response.name.value;
      }));
  }
}

