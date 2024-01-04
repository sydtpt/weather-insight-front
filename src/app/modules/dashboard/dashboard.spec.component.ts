import { TestBed } from '@angular/core/testing';
import { DashBoardComponent } from './dashboard.component';

describe('FooterComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashBoardComponent],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(DashBoardComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have the 'weather-insight-front' title`, () => {
    const fixture = TestBed.createComponent(DashBoardComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('weather-insight-front');
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(DashBoardComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Hello, weather-insight-front');
  });
});
