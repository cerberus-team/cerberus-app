import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule, MatToolbarModule } from '@angular/material';
import { mockHeaderOptions } from '../../../mock/objects/header-options.mock';
import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MatIconModule,
        MatToolbarModule,
      ],
      declarations: [
        HeaderComponent,
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    component.headerOptions = mockHeaderOptions[0];
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should emit a buttonClick event on clicking sidenavToggle', () => {
    spyOn(component.buttonClick, 'emit');
    component.onToggleSidenav();
    expect(component.buttonClick.emit).toHaveBeenCalledWith('toggle_sidenav');
  });

  it('should emit a buttonClick event on clicking back', () => {
    spyOn(component.buttonClick, 'emit');
    component.onBack();
    expect(component.buttonClick.emit).toHaveBeenCalledWith('back');
  });

  it('should emit a buttonClick event on clicking settings', () => {
    spyOn(component.buttonClick, 'emit');
    component.onSettings();
    expect(component.buttonClick.emit).toHaveBeenCalledWith('settings');
  });

  it('should emit a buttonClick event on clicking log out', () => {
    spyOn(component.buttonClick, 'emit');
    component.onLogOut();
    expect(component.buttonClick.emit).toHaveBeenCalledWith('logOut');
  });

  it('should get the title', () => {
    expect(component.title).toEqual(mockHeaderOptions[0].title);
  });

  it('should use "Loading..." while the title is null', () => {
    delete component.headerOptions;
    expect(component.title).toEqual('Loading...');
  });

  it('should get the headerOptions icon', () => {
    expect(component.icon).toEqual(mockHeaderOptions[0].icon);
  });

  it('should show the back button if previousUrl is set', () => {
    expect(component.showBack).toEqual(!!mockHeaderOptions[0].previousUrl);
  });

  it('should show the settings button if showSettings is true', () => {
    expect(component.showSettings).toEqual(mockHeaderOptions[0].showSettings);
  });
});