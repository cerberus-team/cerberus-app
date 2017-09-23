import { Headers, Http, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { Store } from '@ngrx/store';
import { ErrorService } from './error.service';

abstract class BaseService {
  protected modelName: string;
  protected actionTypes: {
    load: string;
    add: string;
    modify: string;
  };

  constructor(protected http: Http,
              protected store: Store<any>,
              protected errorService: ErrorService) { }

  get options() {
    const headers = new Headers({
      'Content-Type': 'application/json',
      'charset': 'UTF-8',
      'Authorization': localStorage.token
    });
    return new RequestOptions({ headers: headers });
  }

  getAllRx(): void {
    this.http.get(`/api/${this.modelName}s`, this.options)
      .map(res => res.json().map(this.convert))
      .map(payload => ({ type: this.actionTypes.load, payload: payload }))
      .subscribe(action => this.store.dispatch(action));
  }

  getByIdRx(id: string): void {
    this.http.get(`/api/${this.modelName}/${id}`, this.options)
      .map(res => this.convert(res.json()))
      .map(payload => ({ type: this.actionTypes.add, payload: payload }))
      .subscribe(action => this.store.dispatch(action), this.errorService.handleHttpError);
  }

  createRx(obj: any, successCb): void {
    this.http.post(`/api/${this.modelName}`, JSON.stringify(obj), this.options)
      .map(res => this.convert(res.json()))
      .map(payload => ({ type: this.actionTypes.add, payload: payload }))
      .subscribe(action => this.store.dispatch(action), this.errorService.handleHttpError, successCb);
  }

  updateRx(obj: any, successCb): void {
    this.http.put(`/api/${this.modelName}/${obj._id}`, JSON.stringify(obj), this.options)
      .map(res => this.convert(res.json()))
      .map(payload => ({ type: this.actionTypes.modify, payload: payload }))
      .subscribe(action => this.store.dispatch(action), this.errorService.handleHttpError, successCb);
  }

  getAll(): Observable<any[]> {
    return this.http.get(`/api/${this.modelName}s`, this.options)
      .map(res => res.json().map(this.convert))
      .catch(this.errorService.handleHttpError);
  }

  count(): Observable<number> {
    return this.http.get(`/api/${this.modelName}s/count`, this.options)
      .map(res => res.json())
      .catch(this.errorService.handleHttpError);
  }

  create(obj: any): Observable<any> {
    return this.http.post(`/api/${this.modelName}`, JSON.stringify(obj), this.options)
      .map(res => this.convert(res.json()))
      .catch(this.errorService.handleHttpError);
  }

  get (obj: any): Observable<any> {
    return this.http.get(`/api/${this.modelName}/${obj._id}`, this.options)
      .map(res => this.convert(res.json()))
      .catch(this.errorService.handleHttpError);
  }

  update(obj: any): Observable<any> {
    return this.http.put(`/api/${this.modelName}/${obj._id}`, JSON.stringify(obj), this.options)
      .map(res => this.convert(res.json()))
      .catch(this.errorService.handleHttpError);
  }

  delete(obj: any): Observable<any> {
    return this.http.delete(`/api/${this.modelName}/${obj._id}`, this.options)
      .map(res => this.convert(res.json()))
      .catch(this.errorService.handleHttpError);
  }

  /**
   * Override this function to perform custom conversions to the data, e.g., converting date strings into Date objects (see VisitService).
   * @param data
   * @returns {any}
   */
  convert(data: any) {
    return data;
  }
}

export default BaseService
