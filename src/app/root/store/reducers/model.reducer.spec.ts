import { sortVisitsByStartedAt } from '../../../functions';
import { createMockSites } from '../../../mock/objects/site.mock';
import { createMockVisits } from '../../../mock/objects/visit.mock';
import { createMockVolunteers } from '../../../mock/objects/volunteer.mock';
import * as ModelActions from '../actions/model.actions';
import { modelReducer } from './model.reducer';

describe('modelReducer', () => {
  describe('LOAD_SITES_SUCCESS', () => {
    it('sets the sites', () => {
      const sites = createMockSites();
      const state = modelReducer(
        undefined,
        new ModelActions.LoadSitesSuccess(sites),
      );
      expect(state.sites).toEqual(sites);
    });
  });

  describe('LOAD_VISITS_SUCCESS', () => {
    it('sets the visits, sorted by date', () => {
      const visits = createMockVisits();
      const state = modelReducer(
        undefined,
        new ModelActions.LoadVisitsSuccess(visits),
      );
      expect(state.visits).toEqual(sortVisitsByStartedAt(visits));
    });
  });

  describe('LOAD_VOLUNTEERS_SUCCESS', () => {
    it('sets the volunteers', () => {
      const volunteers = createMockVolunteers();
      const state = modelReducer(
        undefined,
        new ModelActions.LoadVolunteersSuccess(volunteers),
      );
      expect(state.volunteers).toEqual(volunteers);
    });
  });
});
