import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { Store } from '@ngrx/store';

import { testVolunteers, Volunteer } from '../models/volunteer';
import { ADD_VOLUNTEER, LOAD_VOLUNTEERS } from '../reducers/volunteer';
import BaseService from './base.service';
import ErrorService from './error.service';

@Injectable()
export class VolunteerService extends BaseService {
  model = Volunteer;
  modelName = 'volunteer';

  constructor(protected http: Http, private store: Store<Volunteer[]>, protected errorService: ErrorService) {
    super(http, errorService);
  }

  getAllRx(): void {
    this.http.get(`/api/${this.modelName}s`, this.options)
      .map(res => res.json().map(this.convert))
      .map(payload => ({ type: LOAD_VOLUNTEERS, payload: payload }))
      .subscribe(action => this.store.dispatch(action), err => this.errorService.handleHttpError(err));
  }

  createRx(obj: any, successCb, errorCb): void {
    this.http.post(`/api/${this.modelName}`, JSON.stringify(obj), this.options)
      .map(res => this.convert(res.json()))
      .map(payload => ({ type: ADD_VOLUNTEER, payload: payload }))
      .subscribe(action => this.store.dispatch(action), errorCb, successCb);
  }
}

export class MockVolunteerService extends VolunteerService {

  constructor() {
    super(null, null, null);
  }

  getAllRx(): void { }

  createRx(obj: any): void { }

  getAll(): Observable<Volunteer[]> {
    return Observable.of(testVolunteers);
  }

  count(): Observable<number> {
    return Observable.of(testVolunteers.length);
  }

  create(obj: Volunteer): Observable<Volunteer> {
    return Observable.of(testVolunteers[0]);
  }

  get(obj: Volunteer): Observable<Volunteer> {
    return Observable.of(testVolunteers[0]);
  }

  update(obj: Volunteer): Observable<Volunteer> {
    return Observable.of(testVolunteers[0]);
  }

  delete(obj: Volunteer): Observable<Volunteer> {
    return Observable.of(testVolunteers[0]);
  }
}
