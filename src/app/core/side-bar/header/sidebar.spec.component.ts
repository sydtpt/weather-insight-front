import { TestBed } from '@angular/core/testing';
import { SideBarComponent } from './sidebar.component';

describe('SideBarComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SideBarComponent],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(SideBarComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have the 'weather-insight-front' title`, () => {
    const fixture = TestBed.createComponent(SideBarComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('weather-insight-front');
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(SideBarComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Hello, weather-insight-front');
  });
});
