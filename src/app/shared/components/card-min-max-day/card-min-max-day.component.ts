import { ChangeDetectionStrategy, Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { RawDataResponse, datasetInit } from '../../models/http-generic-response.model';

@Component({
  selector: 'app-card-min-max-day',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './card-min-max-day.component.html',
  styleUrl: './card-min-max-day.component.less',
})
export class CardMinMaxDayComponent {
  isLoading = signal(true);
  dataset =  signal<RawDataResponse>(datasetInit);
  @Input({required: true, alias: "dataset"}) set _dataset(dataset: RawDataResponse) {
    this.dataset.set(dataset);
    this.isLoading.set(false)
}

  ngOnInit() {
  }

  getMin(){
    let minValues: number[] = Object.values(this.dataset().temperature_2m_min);
    let min = Math.min(...minValues);
    let roundMin = Math.round(Math.abs(min));
    roundMin *= Math.sign(min);
    let minDayIndex = Object.values(this.dataset().temperature_2m_min).findIndex(
      (i) => i === min
    );
    return {temp: roundMin, date: new Date(this.dataset().date[minDayIndex])};
  }

  getMax(){
    let maxValues: number[] = Object.values(this.dataset().temperature_2m_max);
    let max = Math.max(...maxValues);
    let roundMax = Math.round(Math.abs(max));
    roundMax *= Math.sign(max);
    let maxDayIndex = Object.values(this.dataset().temperature_2m_max).findIndex(
      (i) => i === max
    );
    return {temp: roundMax, date: new Date(this.dataset().date[maxDayIndex])};
  }
}

