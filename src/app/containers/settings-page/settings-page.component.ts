import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import { Subscription } from 'rxjs/Subscription';
import * as AppActions from '../../actions/app.actions';
import * as SettingsActions from '../../actions/settings.actions';
import { getLocalStorageObject } from '../../functions/localStorageObject';
import { HeaderOptions } from '../../models/header-options';
import { Organization } from '../../models/organization';
import { SidenavOptions } from '../../models/sidenav-options';
import { User } from '../../models/user';
import { State } from '../../reducers';

@Component({
  selector: 'app-settings-page',
  templateUrl: './settings-page.component.html',
  styleUrls: ['./settings-page.component.scss']
})
export class SettingsPageComponent implements OnInit {

  settingsSubscription: Subscription;
  sidenavSelection: string;
  validReport: any;

  userFormTitle: string;
  // User entered in form
  validUser: User;
  // Initial user used to pre populate form
  initialUser: User;

  organizationFormTitle: string;
  validOrganization: Organization;
  initialOrganization: Organization;

  constructor(private store: Store<State>) {
    this.userFormTitle = 'Update user data.';
    this.organizationFormTitle = 'Update organization data.';
    this.initialUser = getLocalStorageObject('user');
    this.initialOrganization = getLocalStorageObject('organization');
  }

  ngOnInit() {
    this.store.dispatch(new AppActions.SetHeaderOptions(
      new HeaderOptions(
        'Settings',
        'settings',
        '/dashboard'
      )
    ));
    this.store.dispatch(new AppActions.SetSidenavOptions([
      new SidenavOptions('User', 'face', new SettingsActions.SetSidenavSelection('User')),
      new SidenavOptions('Organization', 'domain', new SettingsActions.SetSidenavSelection('Organization')),
      new SidenavOptions('Reports', 'assessment', new SettingsActions.SetSidenavSelection('Reports'))
    ]));
    this.settingsSubscription = this.store
      .select('settings')
      .subscribe(state => {
        this.sidenavSelection = state.sidenavSelection;
    });
  }

  /**
   * Once the user-form emits an event,
   * set user.
   * @param $event
   */
  setUser($event) {
    this.validUser = $event;
  }

  /**
   * Once the organization-form emits an event,
   * set organization.
   * @param $event
   */
  setOrganization($event) {
    this.validOrganization = $event;
  }

  /**
   * Once the report-form emits an event,
   * set report.
   * @param $event
   */
  setReport($event) {
    console.log($event);
    this.validReport = $event;
  }

  onUserFormSubmit() {
    this.store.dispatch(new SettingsActions.UpdateUser(this.validUser));
  }

  onOrganizationFormSubmit() {
    this.store.dispatch(new SettingsActions.UpdateOrganization(this.validOrganization));
  }
}
