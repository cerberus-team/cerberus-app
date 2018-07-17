import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MatIconModule, MatToolbarModule } from '@angular/material';
import { By } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import * as AuthActions from '../../../auth/store/actions/auth.actions';
import { mockStoreModules } from '../../../mock/store-modules.mock';
import * as LayoutActions from '../../store/actions/layout.actions';
import * as RouterActions from '../../store/actions/router.actions';
import { HeaderComponent } from './header.component';

fdescribe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        HeaderComponent,
      ],
      imports: [
        MatIconModule,
        MatDialogModule,
        MatToolbarModule,
        ...mockStoreModules,
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should handle clicks to the toggle sidenav button by dispatching LayoutActions.ToggleSidenavOpened', async(() => {
    const dispatch = spyOn(TestBed.get(Store), 'dispatch');
    component.headerState$.subscribe(() => {
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        const toggleSidenavButton = fixture.debugElement.query(By.css('#toggle-sidenav-button'));
        toggleSidenavButton.triggerEventHandler('click', {});
        expect(dispatch).toHaveBeenCalledWith(new LayoutActions.ToggleSidenavOpened());
      });
    });
  }));

  it('should handle clicks to the back button by dispatching RouterActions.Back', async(() => {
    const dispatch = spyOn(TestBed.get(Store), 'dispatch');
    component.headerState$.subscribe(() => {
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        const toggleSidenavButton = fixture.debugElement.query(By.css('#back-button'));
        toggleSidenavButton.triggerEventHandler('click', {});
        expect(dispatch).toHaveBeenCalledWith(new RouterActions.Back());
      });
    });
  }));

  it('should handle clicks to the settings button by opening the password dialog', async(() => {
    const openAndSubscribeToPasswordDialog = spyOn(component, 'openAndSubscribeToPasswordDialog');
    component.headerState$.subscribe(() => {
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        const toggleSidenavButton = fixture.debugElement.query(By.css('#settings-button'));
        toggleSidenavButton.triggerEventHandler('click', {});
        expect(openAndSubscribeToPasswordDialog).toHaveBeenCalled();
      });
    });
  }));

  it('should handle clicks to the log out button by dispatching AuthActions.SignOut', async(() => {
    const dispatch = spyOn(TestBed.get(Store), 'dispatch');
    component.headerState$.subscribe(() => {
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        const toggleSidenavButton = fixture.debugElement.query(By.css('#log-out-button'));
        toggleSidenavButton.triggerEventHandler('click', {});
        expect(dispatch).toHaveBeenCalledWith(new AuthActions.SignOut());
      });
    });
  }));
});
