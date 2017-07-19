import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { Store } from '@ngrx/store';
import { ADD_VOLUNTEER, LOAD_VOLUNTEERS, MODIFY_VOLUNTEER } from '../reducers/volunteer';

import BaseService from './base.service';
import { testVolunteers, Volunteer } from '../models/volunteer';

@Injectable()
export class VolunteerService extends BaseService {
  model = Volunteer;
  modelName = 'volunteer';

  constructor(http: Http, private store: Store<Volunteer[]>) {
    super(http);
  }

  createRx(obj: any): void {
    this.http.post(`/api/${this.modelName}`, JSON.stringify(obj), this.options)
      .map(res => this.convert(res.json()))
      .map(payload => ({ type: ADD_VOLUNTEER, payload: payload }))
      .subscribe(action => this.store.dispatch(action));
  }
}

export class MockVolunteerService extends VolunteerService {

  constructor() {
    super(null, null);
  }

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
