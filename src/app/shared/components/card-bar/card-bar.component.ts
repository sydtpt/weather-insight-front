import { Component, ViewChild, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import {
  ChartComponent,
  NgApexchartsModule
} from "ng-apexcharts";
import { DailyHistoryResponse } from '../../models/forecast-response.model';
import { DailyStore } from '../../../store/daily-data.store';

@Component({
  selector: 'app-card-bar',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NgApexchartsModule],
  templateUrl: './card-bar.component.html',
  styleUrl: './card-bar.component.less'
})
export class CardBarComponent {
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<any>;
  dailyStore = inject(DailyStore);

  data: DailyHistoryResponse;

  constructor(){
    effect(() => {
      this.data = this.dailyStore.values();
      if(Object.keys(this.data).length) {
        this.createChart(this.data);
      }
    });
  }

  ngOnInit(): void {
  }

  createChart(data: DailyHistoryResponse){
    let minTemp = Math.min( ...data.apparent_temperature_min, ...data.temperature_2m_min);
    minTemp = minTemp > 0 ? 0 : minTemp;
    data.date = data.date ? data.date : [];
    this.chartOptions = {
      colors: ['#4154f1', '#F9CE1D', '#4154f1'],
      series: [
        {
          name: "mm",
          data: data["precipitation_sum"]
        }
      ],
      chart: {
        height: 400,
        type: "bar",

      },
      dataLabels: {
        enabled: false
      },
      legend: {
        tooltipHoverFormatter: (val: any, opts: any) => {
          return (
            val + " - <strong>" + parseFloat(opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex]).toFixed(1) + "</strong>"
          );
        }
      },
      
      xaxis: {
        labels: {
          trim: true,
          hideOverlappingLabels: true,
          style: {
            fontSize: '12px',
            fontFamily: 'Helvetica, Arial, sans-serif',
            fontWeight: 400,
            cssClass: 'apexcharts-xaxis-label',
        },
        },
        categories: Object.values(data.date).map((day: any) => new Date(day).getFullYear().toString().slice(-2))
      },
      yaxis: {
        labels: {
          trim: true,
          formatter: (value: any) => {
            let arredondado = Math.round(Math.abs(value)); // Arredonda o número para o inteiro mais próximo
            arredondado *= Math.sign(value);
            return arredondado;
          }
        },
      },
      stroke: {
        width: 2.5
      },
      grid: {
        borderColor: "#f1f1f1"
      }
    };
  }
  

  getTodayDescription() {
    if(!this.data || !this.data.date) {
      return "";
    }
    const date = new Date(this.data.date[0])
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });
    const formattedDate = `${day}, ${month}`;
    return `Every ${formattedDate} since 1940`;
  }
}
