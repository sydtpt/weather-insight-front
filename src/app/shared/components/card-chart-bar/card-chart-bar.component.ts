import {
  ChangeDetectionStrategy,
  Component,
  Input,
  ViewChild,
  signal,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterOutlet } from "@angular/router";
import { ChartComponent, NgApexchartsModule } from "ng-apexcharts";
import {
  datasetInit,
} from "../../models/http-generic-response.model";
import { Card, initialCard } from "../../models/card.model";
import { Chart } from "../../utils/chart-parser";

@Component({
  selector: "app-card-chart-bar",
  standalone: true,
  imports: [CommonModule, RouterOutlet, NgApexchartsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./card-chart-bar.component.html",
  styleUrl: "./card-chart-bar.component.less",
})
export class CardChartBarComponent {
  isLoading = signal(true);
  @ViewChild("chart") chart: ChartComponent;
  @Input({ required: true, alias: "card" }) set _card(card: Card) {
    this.card.set(card);
    this.createChart();
  }
  card = signal<Card>(initialCard);
  dataset = signal(datasetInit);
  chartOptions: Partial<any>;

  createChart() {
    let chartOptions: Chart = new Chart();
    chartOptions.chart.type = "bar";
    let colors = this.card().colors;
    if (colors) {
      chartOptions.colors = colors;
    }
    /*Object.keys(this.card().series).forEach(key => {
      dalayEmit(chartOptions, this.card().series[key])
    });*/
    chartOptions.xaxis.categories = <any>(
      Object.values(this.card().categories).map((day: any) =>
        new Date(day).getFullYear().toString().slice(-2)
      )
    );
    chartOptions.series = <any>this.card().series;
    this.chartOptions = chartOptions;
    this.isLoading.set(false);
  }
}
