import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { RawDataResponse } from '../../models/http-generic-response.model';

@Component({
  selector: 'app-card-min-max-day',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './card-min-max-day.component.html',
  styleUrl: './card-min-max-day.component.less',
})
export class CardMinMaxDayComponent {
  @Input() dataset: RawDataResponse;


  ngOnInit() {
    console.log(this.dataset);
  }


  getMinMaxTemp() {
    let minValues: number[] = Object.values(this.dataset.temperature_2m_min);
    let min = Math.min(...minValues);
    let roundMin = Math.round(Math.abs(min)); // Arredonda o número para o inteiro mais próximo
    roundMin *= Math.sign(min);
    let minDay = Object.values(this.dataset.temperature_2m_min).findIndex(
      (i) => i === min
    );
    minDay = this.dataset.date ? this.dataset.date[minDay] : 0;

    let maxValues: number[] = Object.values(this.dataset.temperature_2m_max);
    let max = Math.max(...maxValues);
    let roundMax = Math.round(Math.abs(max)); // Arredonda o número para o inteiro mais próximo
    roundMax *= Math.sign(max);
    let maxDay = Object.values(this.dataset.temperature_2m_max).findIndex(
      (i) => i === max
    );
    maxDay = this.dataset.date ? this.dataset.date[maxDay] : 0;
    let avgs: any = Object.values(this.dataset.apparent_temperature_mean);

    const LIMIT_AVG_YEARS = 20;
    avgs = avgs.slice(avgs.length - LIMIT_AVG_YEARS, avgs.length + 1);

    let avg = avgs.reduce((sum: any, d) => sum + d, 0) / avgs.length;
    let temp = {
      min: roundMin,
      max: roundMax,
      minDay: new Date(minDay).getFullYear(),
      maxDay: new Date(maxDay).getFullYear(),
      avg: avg,
    };
    return temp;
  }

  getMin(){
    let minValues: number[] = Object.values(this.dataset.temperature_2m_min);
    let min = Math.min(...minValues);
    let roundMin = Math.round(Math.abs(min));
    roundMin *= Math.sign(min);
    let minDayIndex = Object.values(this.dataset.temperature_2m_min).findIndex(
      (i) => i === min
    );
    return {temp: roundMin, date: new Date(this.dataset.date[minDayIndex])};
  }

  getMax(){
    let maxValues: number[] = Object.values(this.dataset.temperature_2m_max);
    let max = Math.max(...maxValues);
    let roundMax = Math.round(Math.abs(max));
    roundMax *= Math.sign(max);
    let maxDayIndex = Object.values(this.dataset.temperature_2m_max).findIndex(
      (i) => i === max
    );
    return {temp: roundMax, date: new Date(this.dataset.date[maxDayIndex])};
  }
}

