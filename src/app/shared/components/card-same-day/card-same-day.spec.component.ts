import { TestBed } from '@angular/core/testing';
import { CardSameDayComponent } from './card-same-day.component';

describe('CardSameDayComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardSameDayComponent],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(CardSameDayComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(CardSameDayComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Hello, weather-insight-front');
  });
});
