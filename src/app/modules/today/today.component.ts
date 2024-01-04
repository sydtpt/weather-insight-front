import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { CardSameDayComponent } from '../../shared/components/card-same-day/card-same-day.component';
import { CityService } from '../../shared/services/city.service';
import { ReportsService } from '../../shared/services/reports.service';
import { CardMinMaxDayComponent } from '../../shared/components/card-min-max-day/card-min-max-day.component';
import { CardMoonPhaseComponent } from '../../shared/components/card-moon-phase/card-moon-phase.component';
import { CardTempDayComponent } from '../../shared/components/card-temp-day/card-temp-day.component';

const cards = [CardMoonPhaseComponent, CardSameDayComponent, CardMinMaxDayComponent, CardTempDayComponent];


@Component({
  selector: 'app-today',
  standalone: true,
  imports: [CommonModule, RouterOutlet, ...cards],
  templateUrl: './today.component.html',
  styleUrl: './today.component.less'
})
export class TodayComponent {
  title = 'weather-insight-front';

  constructor(){
  }
  ngOnInit() {

  }

}
