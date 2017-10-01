import { ActionReducerMap } from '@ngrx/store';
import * as fromSite from './sites.reducer';
import * as fromOrganization from './organizations.reducer';
import * as fromVisit from './visits.reducer';
import * as fromVolunteer from './volunteers.reducer';
import * as fromUser from './users.reducer';

export interface State {
  sites: fromSite.State;
  organizations: fromOrganization.State;
  visits: fromVisit.State;
  volunteers: fromVolunteer.State;
  users: fromUser.State;
}

export const reducers: ActionReducerMap<State> = {
  sites: fromSite.reducer,
  organizations: fromOrganization.reducer,
  visits: fromVisit.reducer,
  volunteers: fromVolunteer.reducer,
  users: fromUser.reducer
};