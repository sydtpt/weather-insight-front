import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { ReportsService } from '../../services/reports.service';
import { CityService } from '../../services/city.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-card-min-max-day',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './card-min-max-day.component.html',
  styleUrl: './card-min-max-day.component.less'
})
export class CardMinMaxDayComponent {
  public data$ = this.reportService.getMinAndMaxPerDay();

  constructor(public reportService: ReportsService){
  }
}

