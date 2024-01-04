import { TestBed } from '@angular/core/testing';
import { TodayComponent } from './today.component';

describe('TodayComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodayComponent],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(TodayComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have the 'weather-insight-front' title`, () => {
    const fixture = TestBed.createComponent(TodayComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('weather-insight-front');
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(TodayComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Hello, weather-insight-front');
  });
});
