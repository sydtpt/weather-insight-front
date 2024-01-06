import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { CardSameDayComponent } from '../../shared/components/card-same-day/card-same-day.component';
import { CityService } from '../../shared/services/city.service';
import { ReportsService } from '../../shared/services/reports.service';
import { CardMinMaxDayComponent } from '../../shared/components/card-min-max-day/card-min-max-day.component';
import { CardMoonPhaseComponent } from '../../shared/components/card-moon-phase/card-moon-phase.component';
import { CardTempDayComponent } from '../../shared/components/card-temp-day/card-temp-day.component';
import { FormsModule } from '@angular/forms';

const cards = [CardMoonPhaseComponent, CardSameDayComponent, CardMinMaxDayComponent, CardTempDayComponent];


@Component({
  selector: 'app-today',
  standalone: true,
  imports: [CommonModule, RouterOutlet, FormsModule, ...cards],
  templateUrl: './today.component.html',
  styleUrl: './today.component.less'
})
export class TodayComponent {
  title = 'weather-insight-front';

  date = new Date();
  private readonly maxDate = new Date(this.date);
  constructor(private reportService: ReportsService){
    this.reportService.getDayForecast(this.date).subscribe();
    this.reportService.getHistoricalDDMM(this.date).subscribe();
  }
  ngOnInit() {
    this.maxDate.setDate(this.date.getDate() + 7)
    console.log(this.maxDate)
  }

  changeDay(date) {
    const data = this.date;
    const ano = data.getFullYear();
    const mes = ('0' + (data.getMonth() + 1)).slice(-2); // Adiciona 1 ao mês (pois janeiro é 0) e formata para 2 dígitos
    const dia = ('0' + data.getDate()).slice(-2); // Formata para 2 dígitos
    const dataFormatada = `${ano}-${mes}-${dia}`;
    if (!date || dataFormatada === date) {
      return;
    }
    const timestamp = new Date(date);
    this.date = new Date(timestamp);
    this.reportService.getHistoricalDDMM(this.date).subscribe();
  }

  getMaxDayForecast() {
    return this.maxDate.toISOString().split('T')[0];
  }



}
