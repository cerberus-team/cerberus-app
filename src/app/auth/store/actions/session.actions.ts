import { Action } from '@ngrx/store';
import { User as FirebaseUser } from 'firebase';
import { Organization, User } from '../../../models';

export const LOAD_DATA = '[Session] Load data';
export const LOAD_DATA_SUCCESS = '[Session] Load data success';
export const UPDATE_ORGANIZATION = '[Session] Update organization';
export const UPDATE_USER = '[Session] Update user';

export class LoadData implements Action {
  readonly type = LOAD_DATA;

  constructor(public payload: FirebaseUser) {}
}

/**
 * Used when user initially logs in.
 */
export class LoadDataSuccess implements Action {
  readonly type = LOAD_DATA_SUCCESS;

  constructor(public payload: {
    user: User,
    organization: Organization,
  }) {}
}

/**
 * Used when Organization is updated.
 */
export class UpdateOrganization implements Action {
  readonly type = UPDATE_ORGANIZATION;

  constructor(public payload: Organization) {}
}

/**
 * Used when User is updated.
 */
export class UpdateUser implements Action {
  readonly type = UPDATE_USER;

  constructor(public payload: User) {}
}

export type All
  = LoadData
  | LoadDataSuccess
  | UpdateOrganization
  | UpdateUser;