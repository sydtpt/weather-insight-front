import { Component, Input, computed, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { DailyStore } from '../../../store/daily-data.store';

@Component({
  selector: 'app-card-min-max-day',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './card-min-max-day.component.html',
  styleUrl: './card-min-max-day.component.less'
})
export class CardMinMaxDayComponent {
  dailyStore = inject(DailyStore);

}

