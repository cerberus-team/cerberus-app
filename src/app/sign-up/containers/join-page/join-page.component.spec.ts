import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCheckboxModule, MatStepperModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoreModule } from '@ngrx/store';
import { MockComponent } from 'ng2-mock-component';
import { getTestUsers, testOrganizations } from '../../../models';
import { reducers } from '../../../root/store/reducers';
import { AuthService, SnackBarService } from '../../../services';
import { mockServiceProviders } from '../../../services/mock-service-providers';
import { JoinPageComponent } from './join-page.component';

describe('JoinPageComponent', () => {
  let component: JoinPageComponent;
  let fixture: ComponentFixture<JoinPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        MatCheckboxModule,
        MatStepperModule,
        StoreModule.forRoot(reducers),
      ],
      declarations: [
        JoinPageComponent,
        MockComponent({ selector: 'app-user-form', inputs: ['initialUser', 'passwordRequired'] }),
        MockComponent({ selector: 'app-find-organization', inputs: ['showTitle', 'showInputIconButton'] }),
        MockComponent({ selector: 'app-services-agreement', inputs: ['showTitle'] }),
      ],
      providers: [].concat(mockServiceProviders),
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JoinPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle userChanges events by setting userChanges', () => {
    component.onValidUser(getTestUsers()[0]);
    expect(component.validUser).toEqual(getTestUsers()[0]);
  });

  it('should get Organization by name', () => {
    component.organizations = testOrganizations;
    expect(component.getOrganizationByName(testOrganizations[0].name)).toEqual(testOrganizations[0]);
  });

  describe('onJoinOrganization', () => {

    it('should log out user and display requestToJoinOrganizationSuccess snack bar on success', () => {
      component.organizations = testOrganizations;
      component.validInput = testOrganizations[0].name;
      component.isTosChecked = true;
      const snackBarSpy = spyOn(TestBed.get(SnackBarService), 'requestToJoinOrganizationSuccess');
      const authServiceSignOutSpy = spyOn(TestBed.get(AuthService), 'signOut');
      component.onJoinOrganization();
      expect(snackBarSpy).toHaveBeenCalled();
      expect(authServiceSignOutSpy).toHaveBeenCalled();
    });

    it('should display invalidOrganization snack bar on failure', () => {
      component.organizations = testOrganizations;
      component.validInput = 'abc';
      component.isTosChecked = true;
      const snackBarSpy = spyOn(TestBed.get(SnackBarService), 'invalidOrganization');
      component.onJoinOrganization();
      expect(snackBarSpy).toHaveBeenCalled();
    });
  });
});