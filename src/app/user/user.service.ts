import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Data } from 'src/app/_models/data.model';
import { Status } from 'src/app/_models/status.model';
import { User } from 'src/app/_models/user.model';
import { SingleUser } from '../_models/singleUser.model';
import { delay } from 'rxjs/operators';
import { UserList } from '../_models/userList.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  _apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getUsers(page: number, limit: number, email?: string, username?: string): Observable<Data<UserList>> {
    let paramsUrl = paramUrlGenerator({ page, limit, email, username });
    return this.http.get<Data<UserList>>(`${this._apiUrl}/users${paramsUrl}`).pipe(delay(1000));
  }

  getUserByUserName(username: string): Observable<Data<UserList>> {
    return this.http.get<Data<UserList>>(`${this._apiUrl}/users/?username=${username}`);
  }

  createUser(user: User): Observable<Data<SingleUser>> {
    return this.http.post<Data<SingleUser>>(`${this._apiUrl}/users`, {
      user
    }).pipe(delay(2000))
  }

  getStatuses(): Observable<Data<Status[]>> {
    return this.http.get<Data<Status[]>>(`${this._apiUrl}/statuses`);
  }


}

function paramUrlGenerator(params: object) {
  let paramstring = '';

  for (const key in params) {
    if (params[key]) {
      paramstring === '' ? paramstring += '?' : paramstring += '&'
      paramstring += `${key}=${params[key]}`
    }
  }

  return paramstring
}


