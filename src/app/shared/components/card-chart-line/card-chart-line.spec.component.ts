import { TestBed } from '@angular/core/testing';
import { CardLineChartComponent } from './card-chart-line.component';

describe('CardSameDayComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardLineChartComponent],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(CardLineChartComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(CardLineChartComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Hello, weather-insight-front');
  });
});
