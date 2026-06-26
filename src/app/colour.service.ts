import { Injectable } from '@angular/core';
import { HttpService } from "./http-service.service";
import { Observable, tap, map } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ColourService {

  dailyColour: { r: number, g: number, b: number } | null = null;

  constructor(private httpService: HttpService) { }

  loadDailyColour(): Observable<{ r: number, g: number, b: number }> {
    return this.httpService.get('', 'daily').pipe(
      tap(color => {
        this.dailyColour = color;
      })
    );
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
  getNameByHex(hexValue: string): Observable<string> {
    return this.httpService.get('https://www.thecolorapi.com/','id?hex=%23'+hexValue?.substring(1))
      .pipe(map((response: any) => {
        console.log(response);
        console.log(response.name.value);
        return response.name.value;
      }));
  }
}

