import { Component, ViewChild, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Moon } from "lunarphase-js";
import { ReportsService } from '../../services/reports.service';
@Component({
  selector: 'app-card-moon-phase',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './card-moon-phase.component.html',
  styleUrl: './card-moon-phase.component.less'
})
export class CardMoonPhaseComponent {
  
  _data$;
  date;
  constructor(private reportsService: ReportsService){
    effect(() => {
      let data = this.reportsService.dayForecastSignal();
      let test = !!Object.keys(data).length;
      if (test) {
        this._data$ = data;
        if (Array.isArray(this._data$["daily"].time)) {
          this.date = new Date(this._data$["daily"].time[0] * 1000);
          return;
        }
        this.date = this._data$["daily"].time;
      }
    });
  }

  ngOnInit(): void {
  }

  get sunset(){
    if(this._data$["daily"]) {
      const data = new Date(this._data$["daily"].sunset * 1000); // Multiplica por 1000 para converter para milissegundos
      const hours = ('0' + data.getHours()).slice(-2); // Obter as horas e formatar para 2 dígitos
      const minutes = ('0' + data.getMinutes()).slice(-2); // Obter os minutos e formatar para 2 dígitos

      return `${hours}:${minutes}`
    } else {
      return "";
    }
  }

  get sunrise(){
    if(this._data$["daily"]) {
      const data = new Date(this._data$["daily"].sunrise * 1000); // Multiplica por 1000 para converter para milissegundos
      const hours = ('0' + data.getHours()).slice(-2); // Obter as horas e formatar para 2 dígitos
      const minutes = ('0' + data.getMinutes()).slice(-2); // Obter os minutos e formatar para 2 dígitos

      return `${hours}:${minutes}`
    } else {
      return "";
    }
  }

  getMoonPhaseDescription(date: Date) {
    return Moon.lunarPhase(date);
  }

  getMoonPhaseEmoji(date: Date) {
    return Moon.lunarPhaseEmoji(date);
  }

  
}

