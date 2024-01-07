import { Component, ViewChild, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import {
  ChartComponent,
  NgApexchartsModule
} from "ng-apexcharts";
import { ReportsService } from '../../services/today.service';

@Component({
  selector: 'app-card-same-day',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NgApexchartsModule],
  templateUrl: './card-same-day.component.html',
  styleUrl: './card-same-day.component.less'
})
export class CardSameDayComponent {
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<any>;

  data$;

  constructor(private reportService: ReportsService){
    effect(() => {
      this.data$ = this.reportService.rawDataPerDaySignal();
      let test = !!Object.keys(this.data$).length;
      if (test) {
        this.createChart(this.data$)
      }
    });
  }

  ngOnInit(): void {
  }

  createChart(data: any){
    this.chartOptions = {
      colors: ['#EA3546', '#F9CE1D', '#4154f1'],
      series: [
        {
          name: "Max",
          data: Object.values(data["temperature_2m_max"])
        },

        {
          name: "Avg",
          data: Object.values(data["temperature_2m_mean"])
        },
        {
          name: "Min",
          data: Object.values(data["temperature_2m_min"])
        }

      ],
      chart: {
        height: 400,
        type: "line",

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
        categories: Object.values(data["date"]).map((day: any) => new Date(day).getFullYear().toString().slice(-2))
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
    if(!this.data$ || !this.data$["date"]) {
      return "";
    }
    const date = new Date(this.data$["date"][0])
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });
    const formattedDate = `${day}, ${month}`;
    return `Every ${formattedDate} since 1940`;
  }
}

