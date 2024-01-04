import { TestBed } from '@angular/core/testing';
import { CardTempDayComponent } from './card-temp-day.component';

describe('CardTempDayComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardTempDayComponent],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(CardTempDayComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });


  it('should render title', () => {
    const fixture = TestBed.createComponent(CardTempDayComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Hello, weather-insight-front');
  });
});
