import { ActionReducerMap } from '@ngrx/store';
import { checkInReducer, CheckInReducerState } from './check-in.reducer';

export interface VolunteerSystemState {
  checkIn: CheckInReducerState;
}

export const volunteerSystemReducers: ActionReducerMap<VolunteerSystemState> = {
  checkIn: checkInReducer,
};
