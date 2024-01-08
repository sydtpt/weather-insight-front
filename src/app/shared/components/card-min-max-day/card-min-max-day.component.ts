import { Component, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { ReportsService } from '../../services/today.service';

@Component({
  selector: 'app-card-min-max-day',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './card-min-max-day.component.html',
  styleUrl: './card-min-max-day.component.less'
})
export class CardMinMaxDayComponent {
  isLoading = true;
  data
  constructor(private reportService: ReportsService){
    effect(()=>{
      this.data = this.reportService.getMinAndMaxPerDaySignal();
      if(Object.keys(this.data).length) {
        this.isLoading = !Object.keys(this.data).length ? true: false;}
    })
  }
}

