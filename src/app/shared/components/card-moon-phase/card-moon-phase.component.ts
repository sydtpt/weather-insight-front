import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Moon } from "lunarphase-js";
@Component({
  selector: 'app-card-moon-phase',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './card-moon-phase.component.html',
  styleUrl: './card-moon-phase.component.less'
})
export class CardMoonPhaseComponent {
  public chartOptions: Partial<any>;


  constructor(){
  }

  ngOnInit(): void {
  }

  getMoonPhaseDescription() {
    return Moon.lunarPhase();
  }

  getMoonPhaseEmoji() {
    return Moon.lunarPhaseEmoji();
  }

  
}

