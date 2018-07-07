import { mockOrganizations } from '../../../mock/objects/organization.mock';
import { createMockUsers } from '../../../mock/objects/user.mock';
import * as SessionActions from '../actions/session.actions';
import { sessionReducer } from './session.reducer';

describe('layoutReducer', () => {

  describe('LOAD_DATA_SUCCESS', () => {

    it('loads the User and Organization', () => {
      const state = sessionReducer(
        undefined,
        new SessionActions.LoadDataSuccess({ user: createMockUsers()[0], organization: mockOrganizations[0] }),
      );
      expect(state.user).toEqual(createMockUsers()[0]);
      expect(state.organization).toEqual(mockOrganizations[0]);
    });
  });

  describe('UPDATE_ORGANIZATION', () => {

    it('updates the organization', () => {
      const state = sessionReducer(
        undefined,
        new SessionActions.UpdateOrganization(mockOrganizations[0]),
      );
      expect(state.organization).toEqual(mockOrganizations[0]);
    });
  });

  describe('UPDATE_USER', () => {

    it('updates the user', () => {
      const state = sessionReducer(
        undefined,
        new SessionActions.UpdateUser(createMockUsers()[0]),
      );
      expect(state.user).toEqual(createMockUsers()[0]);
    });
  });
});