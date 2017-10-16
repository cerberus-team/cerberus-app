import { Headers, Http, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { Store } from '@ngrx/store';
import { ErrorService } from './error.service';

abstract class BaseService {
  protected modelName: string;
  protected actions: {
    load: any;
    add: any;
    modify: any;
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

  getAll(): Observable<any[]> {
    return this.http.get(`/api/${this.modelName}s`, this.options)
      .map(res => res.json().map(this.convertIn))
      .catch(this.errorService.handleHttpError);
  }

  count(): Observable<number> {
    return this.http.get(`/api/${this.modelName}s/count`, this.options)
      .map(res => res.json())
      .catch(this.errorService.handleHttpError);
  }

  create(obj: any): Observable<any> {
    this.convertOut(obj);
    return this.http.post(`/api/${this.modelName}`, JSON.stringify(obj), this.options)
      .map(res => this.convertIn(res.json()))
      .catch(this.errorService.handleHttpError);
  }

  getById(id: string): Observable<any> {
    return this.http.get(`/api/${this.modelName}/${id}`, this.options)
      .map(res => this.convertIn(res.json()))
      .catch(this.errorService.handleHttpError);
  }

  update(obj: any): Observable<any> {
    this.convertOut(obj);
    return this.http.put(`/api/${this.modelName}/${obj._id}`, JSON.stringify(obj), this.options)
      .map(res => this.convertIn(res.json()))
      .catch(this.errorService.handleHttpError);
  }

  delete(obj: any): Observable<any> {
    this.convertOut(obj);
    return this.http.delete(`/api/${this.modelName}/${obj._id}`, this.options)
      .map(res => this.convertIn(res.json()))
      .catch(this.errorService.handleHttpError);
  }

  /**
   * Override this function to perform custom conversions for http responses.
   * @param data
   * @returns {any}
   */
  convertIn(data: any) {
    return data;
  }

  /**
   * Override this funciton to perform custom converstions prior to http post, delete and put requests.
   * @param data
   * @return {any}
   */
  convertOut(data: any) {
    return data;
  }
}

export default BaseService
