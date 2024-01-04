import { TestBed } from '@angular/core/testing';
import { CardMinMaxDayComponent } from './card-min-max-day.component';

describe('CardMinMaxDayComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardMinMaxDayComponent],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(CardMinMaxDayComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(CardMinMaxDayComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Hello, weather-insight-front');
  });
});
