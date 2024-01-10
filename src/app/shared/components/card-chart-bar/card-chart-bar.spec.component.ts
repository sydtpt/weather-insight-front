import { TestBed } from '@angular/core/testing';
import { CardChartBarComponent } from './card-chart-bar.component';

describe('CardChartBarComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardChartBarComponent],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(CardChartBarComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(CardChartBarComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Hello, weather-insight-front');
  });
});
