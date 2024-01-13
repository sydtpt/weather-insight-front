import { ChangeDetectionStrategy, Component, Input, effect, inject, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterOutlet } from "@angular/router";
import { CardMinMaxDayComponent } from "../../shared/components/card-min-max-day/card-min-max-day.component";
import { CardTempDayComponent } from "../../shared/components/card-temp-day/card-temp-day.component";
import { FormsModule } from "@angular/forms";
import { patchState } from "@ngrx/signals";
import { RawDataResponse, datasetInit } from "../../shared/models/http-generic-response.model";
import { RawDataStore } from "../../store/raw-data/raw-data.store";
import { CitiesStore } from "../../store/cities.store";
import { ForecastResponse, forecastInit } from "../../shared/models/forecast-response.model";
import { CardLineChartComponent } from "../../shared/components/card-chart-line/card-chart-line.component";
import { CardChartBarComponent } from "../../shared/components/card-chart-bar/card-chart-bar.component";
import { Card, initialCard } from "../../shared/models/card.model";
import { datasetToChartSeries } from "../../shared/utils/chart-parser";
import { debounceTime, fromEvent, lastValueFrom, of } from "rxjs";

const cards = [
  CardLineChartComponent,
  CardMinMaxDayComponent,
  CardTempDayComponent,
  CardChartBarComponent,
];

@Component({
  selector: "app-today",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterOutlet, FormsModule, ...cards],
  templateUrl: "./today.component.html",
  styleUrl: "./today.component.less",
})
export class TodayComponent {
  limitYearFrom = 1970;
  rawDataStore = inject(RawDataStore);
  private cityStore = inject(CitiesStore);
  date = new Date();
  formattedDate: string;
  readonly maxDate = new Date(this.date);


  originalData: RawDataResponse;
  // Charts Signal's
  data =signal<RawDataResponse>(datasetInit);
  forecast = signal<ForecastResponse>(forecastInit);
  precipitation = signal<Card>(initialCard);
  maxTemperature = signal<Card>(initialCard);
  minTemperature = signal<Card>(initialCard);
  maxWind = signal<Card>(initialCard);



  constructor() {
    effect(() => {
      this.update();
    });
    
  }

  update() {
    this.date = this.rawDataStore.date();
    this.rawDataStore.getHistoricalDDMM(this.date).then((res) => {
      setTimeout(() =>{
        
        this.limitYears(this.limitYearFrom);
        this.precipitation.set(this.getPrecipitationCard())
        this.maxTemperature.set(this.getMaxTemperatureCard())
        this.minTemperature.set(this.getMinTemperatureCard())
        this.maxWind.set(this.getWindSpeedCard())
      },200)
      this.originalData = res;
      let temp = this.rawDataStore.forecast();
      this.data.set(res);
      this.forecast.set(temp);

      patchState(this.rawDataStore, {isLoading: false});
    });
  }

  ngOnInit() {
    this.maxDate.setDate(this.date.getDate() + 7);
    this.formattedDate = this.getDateFormatted(this.date);
    let city = this.cityStore.selectedCity();
    patchState(this.rawDataStore, { date: new Date(), city: city });
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

  interceptRange(event) {
    let year = parseInt(event.srcElement.value);

    const clicks = of(year)
    const result = clicks.pipe(debounceTime(1000));
    result.subscribe(x => console.log(x))

        this.limitYears(year);
    
  }

  limitYears(year: number) {
    let limitAfter = year;
    this.limitYearFrom = limitAfter;
    let dateList = this.originalData.date;
    let startFrom = dateList.filter(date => date.getFullYear()-1 >= limitAfter).length;
    let dataArray = {...this.originalData};
    let keys = Object.keys(dataArray);
    for (let key of keys) {
        dataArray[key] = dataArray[key].slice( dataArray[key].length - startFrom, dataArray[key].length)
    }
    this.data.set(dataArray)
    this.precipitation.set(this.getPrecipitationCard())
    this.maxTemperature.set(this.getMaxTemperatureCard())
    this.minTemperature.set(this.getMinTemperatureCard())
    this.maxWind.set(this.getWindSpeedCard())

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


  getSubtitleDescription() {
    const date = new Date(this.date)
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });
    const formattedDate = `${day}, ${month}`;
    return `Every ${formattedDate} since ${this.limitYearFrom}`;
  }

  getPrecipitationCard() {
    let series = [
      { key: "precipitation_sum", description: "Precipitation" },
      { key: "rain_sum", description: "Rain" },
    ];
    let card: Card = {
      date: this.date,
      title: "Precipitation",
      isDateSerie: true,
      subtitle: this.getSubtitleDescription(),
      categories: this.data().date,
      series: this.getSeries(series),
      colors: ['#008FFB', '#FEB019']
    };
    return card;
  }

  getMaxTemperatureCard(): Card {
    let series = [
      { key: "temperature_2m_max", description: "Max" },
      { key: "apparent_temperature_max", description: "Feels Like" },
    ];
    
    let card: Card = {
      date: this.date,
      title: "Max temperature",
      categories: this.data().date,
      subtitle: this.getSubtitleDescription(),
      series: this.getSeries(series),
      isDateSerie: true,
      colors: ['#EA3546', '#F9CE1D', '#4154f1'],
      dislayTemperatureMarkups: true
    };
    return card;
  }

  getMinTemperatureCard() {
    let series = [
      { key: "temperature_2m_min", description: "Max" },
      { key: "apparent_temperature_min", description: "Feels Like" },
    ];
    let card: Card = {
      date: this.date,
      title: "Min temperature",
      categories: this.data().date,
      isDateSerie: true,
      subtitle: this.getSubtitleDescription(),
      series: this.getSeries(series),
      colors: ['#279EFF', '#F9CE1D', '#4154f1'],
      dislayTemperatureMarkups: true
    };
    return card;
  }

  getWindSpeedCard() {
    let series = [
      { key: "wind_speed_10m_max", description: "Max wind speed" }
    ];
    let card: Card = {
      date: this.date,
      title: "Max wind speed",
      isDateSerie: true,
      categories: this.data().date,
      subtitle: this.getSubtitleDescription(),
      series: this.getSeries(series),
      colors: ['#1B998B'],
      dislayTemperatureMarkups: false
    };
    return card;
  }

  private getSeries(series: {key: string, description}[]) {
    return datasetToChartSeries(this.data(), series);
  }

  dacadeFilters = [];
}


