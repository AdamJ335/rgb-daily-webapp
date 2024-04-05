import { Injectable } from '@angular/core';
import {HttpService} from "./http-service.service";
import {map, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ColourService {

  redValue!: number
  greenValue!: number
  blueValue!: number

  constructor(private httpService: HttpService) { }
  getNameByHex(hexValue: string): Observable<string> {
    return this.httpService.get('https://www.thecolorapi.com/','id?hex=%23'+hexValue?.substring(1))
      .pipe(map((response: any) => {
        console.log("Here is the test")
        console.log(response);
        console.log(response.name.value);
        return response.name.value;
      }));
  }

  setRedValue(redValue:number) {
    this.redValue = redValue
  }
  getRedValue() {
    return this.redValue
  }

  setGreenValue(greenValue:number) {
    this.greenValue = greenValue
  }
  getGreenValue() {
    return this.greenValue
  }

  setBlueValue(blueValue:number) {
    this.blueValue = blueValue
  }
  getBlueValue() {
    return this.blueValue
  }
}
