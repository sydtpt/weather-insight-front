import { TestBed } from '@angular/core/testing';
import { CardBarComponent } from './card-bar.component';

describe('CardBarComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardBarComponent],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(CardBarComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(CardBarComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Hello, weather-insight-front');
  });
});
