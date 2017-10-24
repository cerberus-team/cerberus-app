import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/empty';

import BaseService from './base.service';
import { ErrorService } from './error.service';
import { Site, testSites } from '../models/site';

@Injectable()
export class SiteService extends BaseService<Site> {

  constructor(protected db: AngularFirestore,
              protected errorService: ErrorService) {
    super(db, errorService, 'sites');
  }
}

export class MockSiteService extends SiteService {

  constructor() {
    super(null, null);
  }

  // Base functions

  getAll(): Observable<Site[]> {
    return Observable.of(testSites);
  }

  getById(id: string): Observable<Site> {
    return Observable.of(testSites
      .find(site => site.id === id));
  }

  count(): Observable<number> {
    return Observable.of(testSites.length);
  }

  create(site: Site): Observable<Site> {
    return Observable.of(site);
  }

  update(site: Site): Observable<any> {
    return Observable.empty<any>();
  }

  delete(site: Site): Observable<any> {
    return Observable.empty<any>();
  }
}
