import { Organization, User } from '../../../models';
import * as GettingStartedActions from '../actions/getting-started.actions';

export interface State {
  step: number;
  validOrganization: Organization;
  validUser: User;
}

export const initialState: State = {
  step: 0,
  validOrganization: null,
  validUser: null,
};

export type Action = GettingStartedActions.All;

export function reducer(state = initialState, action: Action): State {
  switch (action.type) {

    /**
     * Sets the selected tab to the next step and only updates state.step
     * if the next step is greater than the previous.
     * action.payload - the next step
     */
    case GettingStartedActions.NEXT_STEP: {
      const next = action.payload;
      return Object.assign({}, state, {
        step: Math.max(state.step, next),
      });
    }

    /**
     * Updates the valid organization.
     * action.payload - the valid organization
     */
    case GettingStartedActions.UPDATE_VALID_ORGANIZATION: {
      return Object.assign({}, state, {
        validOrganization: action.payload,
      });
    }

    /**
     * Updates the valid user.
     * action.payload - the valid user
     */
    case GettingStartedActions.UPDATE_VALID_USER: {
      return Object.assign({}, state, {
        validUser: action.payload,
      });
    }

    default: {
      return state;
    }
  }
}