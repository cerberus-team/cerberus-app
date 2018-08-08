import { Action } from '@ngrx/store';
import { Team } from '../../shared/models';

export enum TeamsPageActionTypes {
  LoadTeams = '[Teams Page] Load Teams',
  LoadTeamsSuccess = '[Teams Page] Load Teams Success',
  CreateTeam = '[Teams Page] Create Team',
  JoinTeam = '[Teams Page] Join Team',
  OpenCreateTeamDialog = '[Teams Page] Open Create Team Dialog',
  OpenJoinTeamDialog = '[Teams Page] Open Find Team Dialog',
  SelectTeam = '[Teams Page] Select Team',
}

/**
 * Every action is comprised of at least a type and an optional
 * payload. Expressing actions as classes enables powerful
 * type checking in reducer functions.
 *
 * See Discriminated Unions: https://www.typescriptlang.org/docs/handbook/advanced-types.html#discriminated-unions
 */
export class LoadTeams implements Action {
  readonly type = TeamsPageActionTypes.LoadTeams;
}

export class LoadTeamsSuccess implements Action {
  readonly type = TeamsPageActionTypes.LoadTeamsSuccess;

  constructor(public payload: { teams: Team[] }) {}
}

export class CreateTeam implements Action {
  readonly type = TeamsPageActionTypes.CreateTeam;

  constructor(public payload: { team: Team }) {}
}

export class JoinTeam implements Action {
  readonly type = TeamsPageActionTypes.JoinTeam;

  constructor(public payload: { team: Team }) {}
}

export class OpenCreateTeamDialog implements Action {
  readonly type = TeamsPageActionTypes.OpenCreateTeamDialog;
}

export class OpenFindTeamDialog implements Action {
  readonly type = TeamsPageActionTypes.OpenJoinTeamDialog;
}

export class SelectTeam implements Action {
  readonly type = TeamsPageActionTypes.SelectTeam;

  constructor(public payload: { team: Team }) {}
}

/**
 * Export a type alias of all actions in this action group
 * so that reducers can easily compose action types
 */
export type TeamsPageActionsUnion =
  | LoadTeams
  | LoadTeamsSuccess
  | CreateTeam
  | JoinTeam
  | OpenCreateTeamDialog
  | OpenFindTeamDialog
  | SelectTeam;