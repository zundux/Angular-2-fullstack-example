// @flow
import {Injectable} from '@angular/core';
import {Response} from '@angular/http';
import {AuthHttp} from 'angular2-jwt';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';

export type ThingType = {
  // TODO: use Mongoose model
  name: string;
  info: string;
  _id: string;
}

@Injectable()
export default class ThingService {
  static parameters = [AuthHttp];
  private AuthHttp: AuthHttp;
  _id: number|string;

  constructor(authHttp: AuthHttp) {
    this.AuthHttp = authHttp;
  }

  handleError(err) {
    Observable.throw(err.json().error || 'Server error');
  }

  query(): Observable<ThingType[]> {
    return this.AuthHttp.get('/api/things/')
      .map((res: Response) => res.json())
      .catch(this.handleError);
  }

  get(thing = {id: 'me'}): Observable<ThingType> {
    return this.AuthHttp.get(`/api/things/${thing.id || thing._id}`)
      .map((res: Response) => res.json())
      .catch(this.handleError);
  }

  create(thing: ThingType) {
    return this.AuthHttp.post('/api/things/', thing)
      .map((res: Response) => res.json())
      .catch(this.handleError);
  }

  changePassword(thing, oldPassword, newPassword) {
    return this.AuthHttp.put(`/api/things/${thing.id || thing._id}/password`, {oldPassword, newPassword})
      .map((res: Response) => res.json())
      .catch(this.handleError);
  }

  remove(thing) {
    return this.AuthHttp.delete(`/api/things/${thing.id || thing._id}`)
      .map(() => thing)
      .catch(this.handleError);
  }
}
