import { ChangeDetectionStrategy, Component, Input, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { RawDataResponse, datasetInit } from '../../models/http-generic-response.model';
import { ChartComponent, NgApexchartsModule } from "ng-apexcharts";

@Component({
  selector: 'app-card-min-max-day',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NgApexchartsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './card-min-max-day.component.html',
  styleUrl: './card-min-max-day.component.less',
})
export class CardMinMaxDayComponent {
  isLoading = signal(true);
  dataset =  signal<RawDataResponse>(datasetInit);
  chartOptions = {
    series: [44, 55, 13, 43, 22],
    chart: <any>{
      type: 'donut',
      height: 175,
      width: 175,
      toolbar: {
        show: false
      }
    },
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: 200
        },
        legend: {
          position: 'bottom'
        }
      }
    }],
    dataLabels: {
      enabled: false
    },
    labels: ['Team A', 'Team B', 'Team C', 'Team D', 'Team E'],
    legend: {
      show: false
    }
  }
  @Input({required: true, alias: "dataset"}) set _dataset(dataset: RawDataResponse) {
    this.dataset.set(dataset);
    this.isLoading.set(false);
  }

  constructor(){
    effect(()=>{
      this.getWeatherRecurrency();
    })
  }

  getMin(){
    let minValues: number[] = Object.values(this.dataset().temperature_2m_min);
    let min = Math.min(...minValues);
    let roundMin = Math.round(Math.abs(min));
    roundMin *= Math.sign(min);
    let minDayIndex = Object.values(this.dataset().temperature_2m_min).findIndex(
      (i) => i === min
    );
    return {temp: roundMin, date: new Date(this.dataset().date[minDayIndex])};
  }

  getMax(){
    let maxValues: number[] = Object.values(this.dataset().temperature_2m_max);
    let max = Math.max(...maxValues);
    let roundMax = Math.round(Math.abs(max));
    roundMax *= Math.sign(max);
    let maxDayIndex = Object.values(this.dataset().temperature_2m_max).findIndex(
      (i) => i === max
    );
    return {temp: roundMax, date: new Date(this.dataset().date[maxDayIndex])};
  }

  getWeatherRecurrency() {
    let grouped = this.groupWeathers(this.dataset().weather_code);
    console.log(grouped)
  }

  groupWeathers(array) {
    const group = {};
    for (let i = 0; i < array.length; i++) {
      const key = array[i];
      if (group[key] !== undefined) {
        group[key]++;
      } else {
        group[key] = 1;
      }
    }
    const grouped: any = [];
    for (const key in group) {
      grouped.push([parseInt(key), group[key]]);
    }
  
    return grouped;
  }
  
}

