import { Component, Input, effect, inject, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterOutlet } from "@angular/router";
import { CardMinMaxDayComponent } from "../../shared/components/card-min-max-day/card-min-max-day.component";
import { CardMoonPhaseComponent } from "../../shared/components/card-moon-phase/card-moon-phase.component";
import { CardTempDayComponent } from "../../shared/components/card-temp-day/card-temp-day.component";
import { FormsModule } from "@angular/forms";
import { patchState } from "@ngrx/signals";
import { RawDataResponse } from "../../shared/models/http-generic-response.model";
import { RawDataStore } from "../../store/raw-data/raw-data.store";
import { CitiesStore } from "../../store/cities.store";
import { ForecastResponse } from "../../shared/models/forecast-response.model";
import { CardLineChartComponent } from "../../shared/components/card-chart-line/card-chart-line.component";
import { CardChartBarComponent } from "../../shared/components/card-chart-bar/card-chart-bar.component";

const cards = [
  CardMoonPhaseComponent,
  CardLineChartComponent,
  CardMinMaxDayComponent,
  CardTempDayComponent,
  CardChartBarComponent,
];

@Component({
  selector: "app-today",
  standalone: true,
  imports: [CommonModule, RouterOutlet, FormsModule, ...cards],
  templateUrl: "./today.component.html",
  styleUrl: "./today.component.less",
})
export class TodayComponent {
  date = new Date();
  formattedDate: string;
  private readonly maxDate = new Date(this.date);
  rawDataStore = inject(RawDataStore);
  private cityStore = inject(CitiesStore);
  dataset: RawDataResponse;
  data2 = signal<number>(0);

  precipitationSeries = [
    { key: "precipitation_sum", description: "Precipitation" },
    { key: "rain_sum", description: "Rain" },
  ];
  precipitationColors: ['#EA3546', '#F9CE1D', '#4154f1'];


  temperatureSeries = [
    { key: "temperature_2m_max", description: "Max" },
    { key: "temperature_2m_mean", description: "Avg" },
    { key: "temperature_2m_min", description: "Min" },
  ];
  temperatureColors = ['#EA3546', '#F9CE1D', '#4154f1'];

  feelsLikeSeries = [
    { key: "apparent_temperature_max", description: "Max" },
    { key: "apparent_temperature_mean", description: "Avg" },
    { key: "apparent_temperature_min", description: "Min" },
  ];
  feelsLikeColors = ['#EA3546', '#F9CE1D', '#4154f1'];

  forecast: ForecastResponse;
  // TO DO
  // temperatureSeries = [{key: "precipitation_sum", description: "precipitation" }, {key: "rain_sum", description: "rain" }];

  constructor() {
    effect(() => {
      
      this.date = this.rawDataStore.date();
      this.rawDataStore.values();
      this.rawDataStore.getHistoricalDDMM(this.date).then((res) => {
        this.dataset = res;

        this.forecast = this.rawDataStore.forecast();
      });
    });
  }

  ngOnInit() {
    this.maxDate.setDate(this.date.getDate() + 7);
    this.formattedDate = this.getDateFormatted(this.date);
    let city = this.cityStore.selectedCity();
    patchState(this.rawDataStore, { date: new Date(), city });
  }

  changeDay(date) {
    const data = this.date;
    const ano = data.getFullYear();
    const mes = ("0" + (data.getMonth() + 1)).slice(-2); // Adiciona 1 ao mês (pois janeiro é 0) e formata para 2 dígitos
    const dia = ("0" + data.getDate()).slice(-2); // Formata para 2 dígitos
    const dataFormatada = `${ano}-${mes}-${dia}`;
    if (!date || dataFormatada === date) {
      return;
    }
    const timestamp = new Date(date);
    this.date = new Date(timestamp);
    this.formattedDate = this.getDateFormatted(this.date);
    patchState(this.rawDataStore, {isLoading:true, date: this.date });
  }

  getMaxDayForecast() {
    return this.maxDate.toISOString().split("T")[0];
  }

  disableNext(): boolean {
    let date = new Date(this.date);
    date.setHours(0, 0, 0);
    let maxDate = new Date(this.maxDate);
    maxDate.setHours(0, 0, 0);
    return this.date >= maxDate;
  }

  previousDay() {
    let newDay = new Date(this.date);
    newDay.setDate(this.date.getDate() - 1);
    this.formattedDate = this.getDateFormatted(newDay);
    this.changeDay(this.formattedDate);
  }

  nextDay() {
    let newDay = new Date(this.date);
    newDay.setDate(this.date.getDate() + 1);
    this.formattedDate = this.getDateFormatted(newDay);
    this.changeDay(this.formattedDate);
  }

  getDateFormatted(date: Date) {
    const ano = date.getFullYear();
    const mes = ("0" + (date.getMonth() + 1)).slice(-2); // Adiciona 1 ao mês (pois janeiro é 0) e formata para 2 dígitos
    const dia = ("0" + date.getDate()).slice(-2); // Formata para 2 dígitos
    return `${ano}-${mes}-${dia}`;
  }

}
