import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import BaseService from './base.service';
import { testVisits, Visit } from '../models/visit';
import { ADD_VISIT, LOAD_VISITS, MODIFY_VISIT } from '../reducers/visit';
import { ErrorService } from './error.service';

@Injectable()
export class VisitService extends BaseService {
  model = Visit;

  constructor(protected http: Http, protected store: Store<Visit[]>, protected errorService: ErrorService) {
    super(http, store, errorService);
    this.modelName = 'visit';
    this.actionTypes = {
      getAll: LOAD_VISITS,
      create: ADD_VISIT,
      update: MODIFY_VISIT
    }
  }

  /**
   * Get all dates that occur after the date provided.
   * @param date
   */
  getByDateRx(date: Date): void {
    this.http.get(`/api/${this.modelName}s/${ date }`, this.options)
      .map(res => res.json().map(this.convertOut))
      .map(payload => ({ type: LOAD_VISITS, payload: payload }))
      .subscribe(action => this.store.dispatch(action), err => this.errorService.handleHttpError(err));
  }

  /**
   * Override to stringify signature.
   * @param visit
   * @returns {any}
   */
  convertOut(visit) {
    // If the visit contains a signature
    if (visit.signature) {
      visit.signature = JSON.stringify(visit.signature);
    }
    return visit
  }

  /**
   * Override to parse startedAt and endedAt Strings into Date objects and to destringify signature.
   * @param visit
   */
  convertIn(visit) {
    visit.startedAt = new Date(visit.startedAt);
    visit.endedAt = visit.endedAt ? new Date(visit.endedAt) : null;
    // If the visit contains a signature
    if (visit.signature) {
      visit.signature = JSON.parse(visit.signature);
    }
    return visit;
  }
}

export class MockVisitService extends VisitService {

  constructor() {
    super(null, null, null);
  }

  getAllRx(): void { }

  createRx(obj: any): void { }

  updateRx(obj: any): void { }

  getAll(): Observable<Visit[]> {
    return Observable.of(testVisits);
  }

  count(): Observable<number> {
    return Observable.of(testVisits.length);
  }

  create(obj: Visit): Observable<Visit> {
    return Observable.of(testVisits[0]);
  }

  get (obj: Visit): Observable<Visit> {
    return Observable.of(testVisits[0]);
  }

  update(obj: Visit): Observable<Visit> {
    return Observable.of(testVisits[0]);
  }

  delete(obj: Visit): Observable<Visit> {
    return Observable.of(testVisits[0]);
  }
}
