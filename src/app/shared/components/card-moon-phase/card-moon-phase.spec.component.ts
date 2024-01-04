import { TestBed } from '@angular/core/testing';
import { CardMoonPhaseComponent } from './card-moon-phase.component';

describe('CardMoonPhaseComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardMoonPhaseComponent],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(CardMoonPhaseComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });


  it('should render title', () => {
    const fixture = TestBed.createComponent(CardMoonPhaseComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Hello, weather-insight-front');
  });
});
