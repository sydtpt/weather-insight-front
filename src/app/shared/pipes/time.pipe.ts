import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "localTime",
  standalone: true,
})
export class LocalTimePipe implements PipeTransform {
  transform(value: any, ...args: any[]): any {
    let sunset = value;
    return sunset
    .toLocaleString("pt-BR", { timeZone: args[0] })
    .split(", ")[1]
    .substring(0, 5);;
  }
}
