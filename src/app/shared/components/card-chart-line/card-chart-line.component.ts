import { ChangeDetectionStrategy, Component, Input, ViewChild, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import {
  ChartComponent,
  NgApexchartsModule
} from "ng-apexcharts";
import { RawDataResponse } from '../../models/http-generic-response.model';

@Component({
  selector: 'app-card-chart-line',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NgApexchartsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './card-chart-line.component.html',
  styleUrl: './card-chart-line.component.less'
})
export class CardLineChartComponent {
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<any>;
  @Input() dataset: RawDataResponse;
  @Input() series: {key: string, description: string}[];
  @Input() colors: string[];
  @Input({required: true}) title: string;
  @Input() subTitle: string;

  constructor(){
    effect(()=>{})
  }

  ngOnInit(): void {
    this.createChart(this.dataset, this.getSeries());
  }

  ngOnChanges() {
    this.createChart(this.dataset, this.getSeries());
  }   

  createChart(data: RawDataResponse, series: any){
    data.date = data.date ? data.date : [];
    this.chartOptions = {
      colors: this.colors,
      series: series,
      chart: {
        height: 400,
        type: "line",

      },
      annotations: {
        yaxis: [{
          y: -50,
          y2: 0,
          borderColor: '#000',
          fillColor: '#9bd2ff',
          opacity: 0.1,

        },{
          y: 28,
          y2: 38,
          borderColor: '#000',
          fillColor: '#fff5ba',
          opacity: 0.1,

        },{
          y: 38,
          y2: 70,
          borderColor: '#000',
          fillColor: '#ffc3bf',
          opacity: 0.1,

        }],
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
        width: 2
      },
      grid: {
        borderColor: "#f1f1f1"
      }
    };
  }
  

  getTodayDescription() {
    if(!this.dataset || !this.dataset["date"]) {
      return "";
    }
    const date = new Date(this.dataset["date"][0])
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });
    const formattedDate = `${day}, ${month}`;
    return `Every ${formattedDate} since 1940`;
  }

  getSeries() {
    return this.series.map( item => {
      return {
        data: this.dataset[item.key], name: item.description 
      }
    });
  }
}
